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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
        Update update = new Update().addToSet("transactions", newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void deposit(Double amount) {
        User currentUser = userController.getLoggedInUser();
        if (currentUser == null) {
            throw new RuntimeException("No authenticated user found");
        }

        String transactionId = UUID.randomUUID().toString();
        double newAmount = currentUser.availableAmount() + amount;
        Transaction newTransaction = new Transaction(transactionId, amount, "Deposit", "", "", "", "", "", "");
        Query query = new Query(where("accountId").is(currentUser.accountId()));
        Update update = new Update().set("availableAmount", newAmount).addToSet("transactions", newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
        communicationService.sendInvoiceEmail(currentUser, newTransaction, newAmount, null);
    }

    public void instantTransfer(String accountId, Double amount, String category, String transactionDetails)
            throws Exception {
        User sender = userController.getLoggedInUser();
        if (sender == null) {
            throw new RuntimeException("Invalid Operation");
        }

        Optional<User> receiverOpt = userRepository.findByAccountId(accountId);
        if (receiverOpt.isEmpty()) {
            throw new RuntimeException("Receiver account not found");
        }
        User receiver = receiverOpt.get();

        if (sender.availableAmount() < amount) {
            throw new RuntimeException("Insufficient fund");
        }

        double newSenderAmount = sender.availableAmount() - amount;
        double newReceiverAmount = receiver.availableAmount() + amount;

        userService.updateBalance(sender.id(), -amount);
        userService.updateBalance(receiver.id(), amount);

        String transactionId = UUID.randomUUID().toString();
        Transaction senderTransaction = new Transaction(transactionId, -1 * amount, "Transfer", sender.name(),
                sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        Transaction receiverTransaction = new Transaction(transactionId, amount, "Transfer", sender.name(),
                sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        addTransaction(sender.accountId(), senderTransaction);
        addTransaction(receiver.accountId(), receiverTransaction);

        // Send email
        try {
            communicationService.sendInvoiceEmail(sender, senderTransaction, newSenderAmount, null);
        } catch (Exception e) {
            // Log the error and continue
            System.err.println("Failed to send invoice email to sender: " + e.getMessage());
        }

        try {
            communicationService.sendInvoiceEmail(receiver, receiverTransaction, newReceiverAmount, null);
        } catch (Exception e) {
            // Log the error and continue
            System.err.println("Failed to send invoice email to receiver: " + e.getMessage());
        }
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

        User newFriend = friendOpt.get();
        Friend friend = new Friend(newFriend.name(), newFriend.accountId());

        Query query = new Query(where("accountId").is(currentUser.accountId()));
        Update update = new Update().addToSet("friends", friend);
        mongoTemplate.updateFirst(query, update, User.class);

    }

    public String findUserNameByAccountId(String accountId) {
        Optional<User> userOpt = userRepository.findByAccountId(accountId);
        return userOpt.map(User::name).orElse(null);
    }

    public void deleteFriend(String friendAccountId) {
        String currentUserId = userController.getLoggedInUser().accountId();
        if (currentUserId == null)
            throw new IllegalArgumentException("Account cannot be null");

        Query query = new Query(where("accountId").is(currentUserId));
        Update update = new Update().pull("friends", new Document("accountId", friendAccountId));
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void overseaTransfer(OverseaTransferRequest overseaTransferRequest) throws Exception {
        User sender = userController.getLoggedInUser();
        if (sender == null)
            throw new RuntimeException("Invalid user");
        Optional<User> receiverOpt = userRepository.findByAccountId(overseaTransferRequest.getReceiverAccountId());
        if (receiverOpt.isEmpty())
            throw new RuntimeException("Invalid target accountId");

        User receiver = receiverOpt.get();
        double convertedAmount = currencyService.convertCurrency(overseaTransferRequest.getBaseCurrency(),
                overseaTransferRequest.getToCurrency(), overseaTransferRequest.getAmount());

        if (sender.availableAmount() < convertedAmount)
            throw new RuntimeException("Insufficient balance");

        userService.updateBalance(sender.id(), -1 * convertedAmount);
        userService.updateBalance(receiver.id(), convertedAmount);

        String transactionId = UUID.randomUUID().toString();
        Transaction senderTransaction = new Transaction(transactionId, -1 * convertedAmount, "Oversea Transfer",
                sender.name(), sender.accountId(), receiver.name(), receiver.accountId(),
                overseaTransferRequest.getCategory(), overseaTransferRequest.getTransactionDetails());
        Transaction receiverTransaction = new Transaction(transactionId, convertedAmount, "Oversea Transfer",
                sender.name(), sender.accountId(), receiver.name(), receiver.accountId(),
                overseaTransferRequest.getCategory(), overseaTransferRequest.getTransactionDetails());

        addTransaction(sender.accountId(), senderTransaction);
        addTransaction(receiver.accountId(), receiverTransaction);

        communicationService.sendInvoiceEmail(sender, senderTransaction, sender.availableAmount(),
                overseaTransferRequest);
        communicationService.sendInvoiceEmail(receiver, receiverTransaction, receiver.availableAmount(),
                overseaTransferRequest);
    }

    public List<Transaction> getTransactionHistory(String startDate, String endDate, String type, String category) {

        Criteria criteria = new Criteria();

        // Assuming you have a method that fetches the currently logged-in user's
        // account ID.
        String currentUserId = userController.getLoggedInUser().accountId();
        criteria.and("accountId").is(currentUserId);

        if (startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate).plusDays(1); // Include the end date in the search
            criteria.and("dateTime").gte(start.atStartOfDay()).lt(end.atStartOfDay());
        }

        if (type != null) {
            criteria.and("type").is(type);
        }

        if (category != null) {
            criteria.and("category").is(category);
        }

        Query query = new Query(criteria);
        return mongoTemplate.find(query, Transaction.class);
    }

}
