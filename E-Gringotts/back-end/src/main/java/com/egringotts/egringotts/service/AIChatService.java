package com.egringotts.egringotts.service;

import com.egringotts.egringotts.controller.UserController;
import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.repository.ChatHistoryRepository;
import com.egringotts.egringotts.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.io.BufferedReader;
import java.io.FileReader;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
@AllArgsConstructor
public class AIChatService {
    private UserController userController;
    private final MongoTemplate mongoTemplate;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    public void addChatHistory(String accountId, AIQnA newAIQnA) {
        Query query = new Query(where("accountId").is(accountId));
        Update update = new Update().addToSet("QnA", newAIQnA);
        mongoTemplate.updateFirst(query, update, ChatHistory.class);
    }

    public void addUserQuestion(String prompt) {
        User currentUser = userController.getLoggedInUser();
        AIQnA newAIQnA = new AIQnA(currentUser.name(), prompt);
        addChatHistory(currentUser.accountId(), newAIQnA);
    }

    public void addAIResponse(String response) {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        AIQnA newAIQnA = new AIQnA("Owl Post", response);
        addChatHistory(currentUserAccId, newAIQnA);
    }

    public String getChatHistory() {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        Optional<ChatHistory> request = chatHistoryRepository.findByAccountId(currentUserAccId);
        if (!request.isEmpty()) {
            List<AIQnA> aiQnAList = request.get().getQnA();
            List<String> question = new ArrayList<>();
            List<String> response = new ArrayList<>();
            for (int i = 0; i < aiQnAList.size(); i++) {
                if (i % 2 == 0)
                    question.add(aiQnAList.get(i).getContent());
                else
                    response.add(aiQnAList.get(i).getContent());
            }
            return "\nThese are the question asked: " + question + "\nThese are the reponse: " + response
                    + "\nand the below are the user information\n<User Information>\n";
        } else
            return "\nThere are no chat history between you two, below are the user information\n<User Information>\n";
    }

    public String getUserInformation() {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        Optional<User> request = userRepository.findByAccountId(currentUserAccId);
        User user = request.get();
        StringBuilder userInfo = new StringBuilder();
        userInfo.append("User name: ").append(user.name()).append("\n");
        userInfo.append("User account id: ").append(user.accountId()).append("\n");
        userInfo.append("User age: ").append(user.age()).append("\n");
        userInfo.append("User Date Of Birth: ").append(user.dateOfBirth()).append("\n");
        userInfo.append("User email: ").append(user.email()).append("\n");
        userInfo.append("User available amount: ").append(user.availableAmount()).append("\n");
        userInfo.append("User tier: ").append(user.userTier()).append("\n");
        userInfo.append("User debit card details: " + " debit card number: ")
                .append(user.debitCardDetails().getDebitCardNumber()).append(" debit card expiry date: ")
                .append(user.debitCardDetails().getDebitExpiryDate()).append(" debit card limit: ")
                .append(user.debitCardDetails().getDebitCardLimit()).append("\n");
        userInfo.append("User credit card details: " + " credit card number: ")
                .append(user.creditCardDetails().getCreditCardNumber()).append(" credit card expiry date: ")
                .append(user.creditCardDetails().getCreditExpiryDate()).append(" credit card limit: ")
                .append(user.creditCardDetails().getCreditCardLimit()).append("\n");
        for (Transaction transaction : user.transactions())
            userInfo.append("User transaction details: ").append(transaction.getDateTime().toString())
                    .append(transaction.getAmount()).append(transaction.getType()).append(transaction.getCategory())
                    .append("\n");
        for (Friend friend : user.friends())
            userInfo.append("User's friends: " + " friend name: ").append(friend.getName())
                    .append("friend account id: ").append(friend.getAccountId()).append("\n");
        return userInfo + "And now this is the question from the user\n<Question>\n";
    }

    public String getGeneralInformation() {
        StringBuilder general = new StringBuilder();
        try (BufferedReader read = new BufferedReader(
                new FileReader("C:\\Users\\Teoh Jia Yong\\OneDrive\\Desktop\\E Gringotts PDF\\E-Gringotts QnA.txt"))) {
            String line;
            while ((line = read.readLine()) != null) {
                general.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return general + "\nAnd here are the chat history you two have:\n<Chat History>\n";
    }
}
