package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.repository.UserRepository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoClient mongoClient;

    public User registerUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        LocalDate birthDate = LocalDate.parse(userDto.getDateOfBirth());

        User user = new User(
                null, // MongoDB generates the ID
                userDto.getName(),
                calculateAge(birthDate),
                generateAccountId(),
                birthDate,
                userDto.getEmail(),
                encodedPassword,
                0, // Initial available amount
                "Silver Snitch", // Default user tier
                userDto.getSecurityPin(),
                new DebitCardDetails(),
                new CreditCardDetails(),
                new ArrayList<>(),
                new ArrayList<>(),
                Collections.singletonList(new Role("USER"))

        );
        return userRepository.save(user);
    }

    private String generateAccountId() {
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with account ID
        Document doc = collection.find().sort(new Document("accountId", -1)).first();

        String lastAccountId = "23000000";
        if (doc != null) {
            lastAccountId = doc.getString("accountId");
        }
        int newAccId = Integer.parseInt(lastAccountId) + 1;
        return String.format("%08d", newAccId);
    }

    private int calculateAge(LocalDate dateOfBirth) {
        return (LocalDate.now().getYear() - dateOfBirth.getYear());
    }
}