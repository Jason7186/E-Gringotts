package com.egringotts.egringotts.service;

import com.egringotts.egringotts.controller.UserController;
import com.egringotts.egringotts.entity.Friend;
import com.egringotts.egringotts.entity.OverseaTransferRequest;
import com.egringotts.egringotts.entity.Transaction;
import com.egringotts.egringotts.entity.User;
import com.egringotts.egringotts.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.UnwindOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
@AllArgsConstructor
public class TransactionService {
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final CommunicationService communicationService;
    private final UserController userController;
    private final CurrencyService currencyService;
    private final UserService userService;

    public void addTransaction(String accountId, Transaction newTransaction) {
        Query query = new Query(where("accountId").is(accountId));
        Update update = new Update().addToSet("transactions",newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void deposit(Double amount, String securityPin) {
        User currentUser = userController.getLoggedInUser();
        if (currentUser.securityPin().compareTo(securityPin) != 0) throw new RuntimeException("Incompatible securityPin");

        String transactionId = UUID.randomUUID().toString();
        double newAmount = currentUser.availableAmount() + amount;
        Transaction newTransaction = new Transaction(transactionId, amount, "Deposit", "", "", "", "", "", "");
        Query query = new Query(where("accountId").is(currentUser.accountId()));
        Update update = new Update().set("availableAmount", newAmount).addToSet("transactions", newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
        communicationService.sendInvoiceEmail(currentUser, newTransaction, newAmount, null);
    }
    public void instantTransfer (String accountId, Double amount, String category, String transactionDetails, String securityPin) throws Exception {
        User sender = userController.getLoggedInUser();

        if (securityPin.compareTo(sender.securityPin()) != 0) throw new RuntimeException("Incompatible securityPin");

        if (amount > sender.maxLimitPerTransfer()) throw new IllegalArgumentException("Please set limit per transaction to a higher amount");

        Optional<User> receiverOpt = userRepository.findByAccountId(accountId);
        if (receiverOpt.isEmpty()) {
            throw new RuntimeException("Receiver account not found");
        }
        User receiver = receiverOpt.get();

        if (sender.accountId().equals(receiver.accountId())) throw new RuntimeException("Invalid operation of instant transferring to own account");

        if (sender.availableAmount() < amount) {
            throw new RuntimeException("Insufficient fund");
        }

        if (sender.dailyAvailableLimit() < amount) {
            throw new IllegalArgumentException("Daily transaction limit has exceeded");
        }

        double newSenderAmount = sender.availableAmount() - amount;
        double newReceiverAmount = receiver.availableAmount() + amount;

        userService.updateBalance(sender.id(), -amount);
        userService.updateBalance(receiver.id(), amount);

        userService.updateDailyAvailableLimit(sender.id(), amount);

        String transactionId = UUID.randomUUID().toString();
        Transaction senderTransaction = new Transaction(transactionId, -1*amount, "Instant Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        Transaction receiverTransaction = new Transaction(transactionId, amount, "Instant Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        addTransaction(sender.accountId(), senderTransaction);
        addTransaction(receiver.accountId(), receiverTransaction);

        //Send email
        communicationService.sendInvoiceEmail(sender, senderTransaction, newSenderAmount, null);
        communicationService.sendInvoiceEmail(receiver, receiverTransaction, newReceiverAmount, null);
    }

    public void addFriend(String accountId) {
        User currentUser = userController.getLoggedInUser();
        if (currentUser == null) {
            throw new RuntimeException("Authentication failed or incorrect user.");
        }

        Optional<User> friendOpt = userRepository.findByAccountId(accountId);
        if (friendOpt.isEmpty()) {
            throw new RuntimeException("Friend account not found");
        }

        if (currentUser.accountId().compareTo(accountId) == 0) {
            throw new RuntimeException("Cannot add yourself as friend");
        }

        User newFriend = friendOpt.get();
        Friend friend = new Friend(newFriend.name(), newFriend.accountId());

        Query query = new Query(where("accountId").is(currentUser.accountId()));
        Update update = new Update().addToSet("friends", friend);
        mongoTemplate.updateFirst(query, update, User.class);

    }

    public String findUserNameByAccountId(String accountId) {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        if (currentUserAccId.compareTo(accountId) == 0) throw new RuntimeException("Invalid operation of finding yourself");

        if (accountId.length() != 8) throw new RuntimeException("Invalid length of accountId. Please enter a valid accountId");

        Optional<User> userOpt = userRepository.findByAccountId(accountId);
        return userOpt.map(User::name).orElse(null);
    }

    public void deleteFriend(String friendAccountId) {
        String currentUserId = userController.getLoggedInUser().accountId();
        if (currentUserId == null) throw new IllegalArgumentException("Account cannot be null");
        if (currentUserId.compareTo(friendAccountId) == 0 ) throw new RuntimeException("Cannot delete yourself");


        Query query = new Query(where("accountId").is(currentUserId));
        Update update = new Update().pull("friends",new Document("accountId", friendAccountId));
        mongoTemplate.updateFirst(query,update, User.class);
    }

    public void overseaTransfer(OverseaTransferRequest overseaTransferRequest) throws Exception {
        User sender = userController.getLoggedInUser();
        if (sender.securityPin().compareTo(overseaTransferRequest.getSecurityPin()) != 0 ) throw new RuntimeException("Incompatible securityPin");
        if (sender.maxLimitPerTransfer() < overseaTransferRequest.getAmount()) throw new RuntimeException("Please set limit per transaction to a higher amount");
        Optional<User> receiverOpt = userRepository.findByAccountId(overseaTransferRequest.getReceiverAccountId());
        if (receiverOpt.isEmpty()) throw new RuntimeException("Invalid target accountId");

        User receiver = receiverOpt.get();

        if (sender.accountId().equals(receiver.accountId())) throw new RuntimeException("Cannot oversea transfer to own account");

        double convertedAmount = currencyService.convertCurrency(overseaTransferRequest.getBaseCurrency(), overseaTransferRequest.getToCurrency(), overseaTransferRequest.getAmount());

        if (sender.availableAmount() < convertedAmount) throw new RuntimeException("Insufficient balance");

        if (sender.dailyAvailableLimit() < convertedAmount) throw new IllegalArgumentException("Daily transaction limit has been exceeded");

        userService.updateBalance(sender.id(), -1*convertedAmount);
        userService.updateBalance(receiver.id(), convertedAmount);

        userService.updateDailyAvailableLimit(sender.id(), convertedAmount);

        String transactionId = UUID.randomUUID().toString();
        Transaction senderTransaction = new Transaction(transactionId, -1*convertedAmount, "Oversea Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), overseaTransferRequest.getCategory(), overseaTransferRequest.getTransactionDetails());
        Transaction receiverTransaction = new Transaction(transactionId, convertedAmount, "Oversea Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), overseaTransferRequest.getCategory(), overseaTransferRequest.getTransactionDetails());

        addTransaction(sender.accountId(), senderTransaction);
        addTransaction(receiver.accountId(), receiverTransaction);

        communicationService.sendInvoiceEmail(sender, senderTransaction, sender.availableAmount(), overseaTransferRequest);
        communicationService.sendInvoiceEmail(receiver, receiverTransaction, receiver.availableAmount(), overseaTransferRequest);
    }

    public List<Transaction> getTransactionsByAccountId(String startDateStr, String endDateStr, List<String> types, List<String> categories) {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        System.out.println(types);
        System.out.println(categories);

        List<AggregationOperation> operations = new ArrayList<>();

        // Match user by accountId
        MatchOperation matchUser = Aggregation.match(Criteria.where("accountId").is(currentUserAccId));
        operations.add(matchUser);

        // Unwind transactions
        UnwindOperation unwindTransactions = Aggregation.unwind("transactions");
        operations.add(unwindTransactions);

        // Replace root with transactions
        AggregationOperation replaceRootWithTransaction = context -> new Document("$replaceRoot", new Document("newRoot", "$transactions"));
        operations.add(replaceRootWithTransaction);

        // Transaction category filter
        if (categories != null && !categories.isEmpty()) {
            Criteria categoryCriteria = Criteria.where("category").in(categories);
            MatchOperation matchCategories = Aggregation.match(categoryCriteria);
            operations.add(matchCategories);
        }

        // Date range filter
        if (startDateStr != null && endDateStr != null) {
            Date startDate = Date.from(LocalDate.parse(startDateStr).atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(LocalDate.parse(endDateStr).plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            MatchOperation matchDateRange = Aggregation.match(Criteria.where("dateTime").gte(startDate).lte(endDate));
            operations.add(matchDateRange);
        }

        // Transaction type filter
        if (types != null && !types.isEmpty()) {
            MatchOperation matchType = Aggregation.match(Criteria.where("type").in(types));
            operations.add(matchType);
        }

        // Build aggregation
        Aggregation aggregation = Aggregation.newAggregation(operations);

        // Execute aggregation
        return mongoTemplate.aggregate(aggregation, "userInfo", Transaction.class).getMappedResults();
    }

}
