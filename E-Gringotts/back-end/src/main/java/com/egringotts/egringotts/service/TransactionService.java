package com.egringotts.egringotts.service;

import com.egringotts.egringotts.controller.UserController;
import com.egringotts.egringotts.entity.Friend;
import com.egringotts.egringotts.entity.Transaction;
import com.egringotts.egringotts.entity.User;
import com.egringotts.egringotts.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
@AllArgsConstructor
public class TransactionService {
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final CommunicationService communicationService;
    private final UserController userController;

    public void addTransaction(String accountId, Transaction newTransaction) {
        Query query = new Query(where("accountId").is(accountId));
        Update update = new Update().addToSet("transactions",newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void deposit(Double amount) throws Exception {
        User currentUser = userController.getLoggedInUser();
        if (currentUser == null) {
            throw new RuntimeException("No authenticated user found");
        }

        // Debug log to verify user details
        System.out.println("Authenticated user: " + currentUser.name());

        double newAmount = currentUser.availableAmount() + amount;
        Transaction newTransaction = new Transaction(amount, "deposit", "", "", "", "", "", "");
        Query query = new Query(where("accountId").is(currentUser.accountId()));
        Update update = new Update().set("availableAmount", newAmount).addToSet("transactions", newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);

        communicationService.sendInvoiceEmail(currentUser, newTransaction, newAmount);
    }
    public void instantTransfer (String accountId, Double amount, String category, String transactionDetails) throws Exception {
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

        //Update availableAmount
        double newSenderAmount = sender.availableAmount() - amount;
        double newReceiverAmount = receiver.availableAmount() + amount;

        //Update sender
        Query senderQuery = new Query(where("accountId").is(sender.accountId()));
        Update senderUpdate = new Update().set("availableAmount", newSenderAmount);
        mongoTemplate.updateFirst(senderQuery, senderUpdate, User.class);

        //Update receiver
        Query receiverQuery = new Query(where("accountId").is(receiver.accountId()));
        Update receiverUpdate = new Update().set("availableAmount", newReceiverAmount);
        mongoTemplate.updateFirst(receiverQuery,receiverUpdate, User.class);

        Transaction senderTransaction = new Transaction(-1*amount, "Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        Transaction receiverTransaction = new Transaction(amount, "Transfer", sender.name(), sender.accountId(), receiver.name(), receiver.accountId(), category, transactionDetails);
        addTransaction(sender.accountId(), senderTransaction);
        addTransaction(receiver.accountId(), receiverTransaction);

        //Send email
        communicationService.sendInvoiceEmail(sender, senderTransaction, newSenderAmount);
        communicationService.sendInvoiceEmail(receiver, receiverTransaction, newReceiverAmount);
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
        if (currentUserId == null) throw new IllegalArgumentException("Account cannot be null");

        Query query = new Query(where("accountId").is(currentUserId));
        Update update = new Update().pull("friends",new Document("accountId", friendAccountId));
        mongoTemplate.updateFirst(query,update, User.class);
    }
}
