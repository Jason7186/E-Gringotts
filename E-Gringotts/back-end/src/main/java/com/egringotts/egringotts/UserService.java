package com.egringotts.egringotts;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoClient mongoClient;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, MongoClient mongoClient) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoClient = mongoClient;
    }

    public User registerUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        User user = new User(
                null, // MongoDB generates the ID
                userDto.getName(),
                calculateAge(userDto.getDateOfBirth()),
                generateAccountId(),
                userDto.getDateOfBirth(),
                userDto.getEmail(),
                encodedPassword,
                0, // Initial available amount
                "Silver Snitch", // Default user tier
                userDto.getSecurityPin(),
                new DebitCardDetails(),
                new CreditCardDetails(),
                new ArrayList<Transaction>()
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

    // no use for now, I just leave this scare later if the auth cant use
    public Optional<User> loginUser(UserDto userDto) {
        Optional<User> optionalUser = userRepository.findByEmail(userDto.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            boolean passwordMatches = passwordEncoder.matches(userDto.getPassword(), user.password());
            boolean pinMatches = userDto.getSecurityPin().equals(user.securityPin());

            if (passwordMatches && pinMatches) return Optional.of(user);
        }
        return Optional.empty();
    }

}
