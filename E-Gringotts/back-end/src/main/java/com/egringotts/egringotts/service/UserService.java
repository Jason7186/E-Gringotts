package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.repository.UserRepository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoClient mongoClient;
    private final MongoTemplate mongoTemplate;

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

    @Transactional
    public void updateBalance(String userId, double galleonAmount) throws Exception {
        Query query = new Query(Criteria.where("id").is(userId));
        User user = mongoTemplate.findOne(query, User.class);

        if (user == null) {
            throw new Exception("User not found");
        }

        double newBalance = user.availableAmount() + galleonAmount;
        if (newBalance < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        Update update = new Update();
        update.set("availableAmount", newBalance);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public UserDashboardDto getUserDashboard(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDashboardDto(
                user.name(),
                user.age(),
                user.accountId(),
                user.dateOfBirth(),
                user.email(),
                user.availableAmount(),
                user.userTier()
        );
    }

    public AdminDashboardDto getAdminDashBoard(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        long totalUser = getUserTotal();
        long totalTransactions = getTotalTransactionsToday();
        return new AdminDashboardDto(user.name(), user.age(), user.accountId(), user.dateOfBirth(), user.email(), user.availableAmount(),user.userTier(), totalUser, totalTransactions);
    }

    public long getUserTotal() {
        return userRepository.count();
    }

    public long getTotalTransactionsToday() {
        ZoneId localZone = ZoneId.of("Asia/Kuala_Lumpur"); // Replace with your local timezone
        LocalDate today = LocalDate.now(localZone);
        LocalDateTime startOfDay = today.atStartOfDay(localZone).toLocalDateTime();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX).atZone(localZone).toLocalDateTime();

        // Match transactions within the date range
        MatchOperation matchOperation = Aggregation.match(Criteria.where("transactions.dateTime").gte(startOfDay).lt(endOfDay));

        // Unwind transactions array
        UnwindOperation unwindOperation = Aggregation.unwind("transactions");

        // Group by transactionId to avoid counting duplicates
        GroupOperation groupOperation = Aggregation.group("transactions.transactionId");

        // Build aggregation
        Aggregation aggregation = Aggregation.newAggregation(matchOperation, unwindOperation, groupOperation);

        // Execute aggregation
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "userInfo", Document.class);

        // Collect unique transactionIds
        Set<String> uniqueTransactionIds = new HashSet<>();
        for (Document document : results) {
            uniqueTransactionIds.add(document.getString("_id"));
        }

        return uniqueTransactionIds.size();
    }


}