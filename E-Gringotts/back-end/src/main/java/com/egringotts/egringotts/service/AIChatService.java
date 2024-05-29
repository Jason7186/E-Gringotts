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
        AIQnA newAIQnA = new AIQnA("Owl Post",response);
        addChatHistory(currentUserAccId,newAIQnA);
    }

    public String getChatHistory() {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        Optional<ChatHistory> request = chatHistoryRepository.findByAccountId(currentUserAccId);
        if (!request.isEmpty()) {
            List<AIQnA> aiQnAList= request.get().getQnA();
            List<String> question = new ArrayList<>();
            List<String> response = new ArrayList<>();
            for (int i = 0; i < aiQnAList.size(); i++) {
                if (i % 2 == 0)
                    question.add(aiQnAList.get(i).getContent());
                else
                    response.add(aiQnAList.get(i).getContent());
            }
            return "\nThese are the question asked: " + question + "\nThese are the reponse: " +response+ "\nand the below are the user information\n<User Information>\n";
        }
        else
            return "\nThere are no chat history between you two, below are the user information\n<User Information>\n";
    }

    public String getUserInformation() {
        String currentUserAccId = userController.getLoggedInUser().accountId();
        Optional<User> request = userRepository.findByAccountId(currentUserAccId);
        User user = request.get();
        StringBuilder userInfo = new StringBuilder();
        userInfo.append("User name: "+user.name()+"\n");
        userInfo.append("User account id: "+user.accountId()+"\n");
        userInfo.append("User age: "+user.age()+"\n");
        userInfo.append("User Date Of Birth: "+user.dateOfBirth()+"\n");
        userInfo.append("User email: "+user.email()+"\n");
        userInfo.append("User available amount: "+user.availableAmount()+"\n");
        userInfo.append("User tier: "+user.userTier()+"\n");
        userInfo.append("User debit card details: "+user.debitCardDetails().getDebitCardNumber() + user.debitCardDetails().getDebitExpiryDate() + user.debitCardDetails().getDebitCardLimit() +  "\n");
        userInfo.append("User credit card details: "+user.creditCardDetails().getCreditCardLimit() + user.creditCardDetails().getCreditCardNumber() + user.creditCardDetails().getCreditExpiryDate() + "\n");
        for (Transaction transaction : user.transactions())
            userInfo.append("User transaction details: "+transaction.getDateTime().toString() + transaction.getAmount() + transaction.getType() + transaction.getCategory() + "\n");
        for (Friend friend : user.friends())
            userInfo.append("User's friends: " + " friend name: "+ friend.getName() + "friend account id: " + friend.getAccountId() + "\n");
        return userInfo+"And now this is the question from the user\n<Question>\n";
    }

    public String getGeneralInformation() {
        StringBuilder general = new StringBuilder();
        try(BufferedReader read = new BufferedReader(new FileReader("C:\\Users\\terng\\OneDrive\\um coding\\react test\\E-Gringotts\\back-end\\src\\main\\java\\com\\egringotts\\egringotts\\service\\E-Gringotts QnA.txt"))) {
            String line;
            while ((line = read.readLine()) != null) {
                general.append(line).append("\n");
            }
        }catch(IOException e) {
            e.printStackTrace();
        }
        return general+"\nAnd here are the chat history you two have:\n<Chat History>\n";
    }
}