package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.repository.ChatHistoryRepository;
import com.egringotts.egringotts.repository.UserRepository;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import lombok.AllArgsConstructor;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;

import com.mongodb.client.model.Aggregates;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoClient mongoClient;
    private final MongoTemplate mongoTemplate;
    private final ChatHistoryRepository chatHistoryRepository;

    public User registerUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        LocalDate birthDate = LocalDate.parse(userDto.getDateOfBirth());
        String generatedAccountId = generateAccountId();

        User user = new User(
                null, // MongoDB generates the ID
                userDto.getName(),
                calculateAge(birthDate),
                generatedAccountId,
                birthDate,
                userDto.getEmail(),
                encodedPassword,
                0.0, // Initial available amount
//                10000.0, // Daily limit
//                10000.0, // Daily available limit
//                3000.0, // Max limit per transfer
                "Silver Snitch", // Default user tier
                userDto.getSecurityPin(),
                new DebitCardDetails(),
                new CreditCardDetails(),
                new ArrayList<>(),
                new ArrayList<>(),
                Collections.singletonList(new Role("USER"))
        );

        ChatHistory chatHistory = new ChatHistory(generatedAccountId, new ArrayList<AIQnA>());

        System.out.println("User created: " + user);
        chatHistoryRepository.save(chatHistory);
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

    public void updateDailyAvailableLimit(String userId, double galleonAmount) throws Exception {
        Query query = new Query(Criteria.where("id").is(userId));
        User user = mongoTemplate.findOne(query, User.class);

        if (user == null) {
            throw new Exception("User not found");
        }

//        Double currentDailyAvailableLimit = user.dailyAvailableLimit();
//        if (currentDailyAvailableLimit == null) {
//            throw new IllegalStateException("dailyAvailableLimit is not set for user: " + userId);
//        }
//
//        double newDailyAvailableLimit = currentDailyAvailableLimit - galleonAmount;
//        if (newDailyAvailableLimit < 0) {
//            throw new IllegalArgumentException("Insufficient Limit");
//        }
//
//        Update update = new Update().set("dailyAvailableLimit", newDailyAvailableLimit);
//        mongoTemplate.updateFirst(query, update, User.class);
    }
    public void updateDailyLimit(User user, double newDailyLimit) throws Exception {
        Query query = new Query(Criteria.where("id").is(user.id()));
        Update update = new Update().set("dailyLimit", newDailyLimit).set("dailyAvailableLimit", newDailyLimit);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void updateMaxLimit(User currentLoggedUser, double newMaxTransferLimit) {
        Query query = new Query(Criteria.where("id").is(currentLoggedUser.id()));
        Update update = new Update().set("maxLimitPerTransfer", newMaxTransferLimit);
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
//                user.dailyLimit(),
//                user.maxLimitPerTransfer()
        );
    }

    public AdminDashboardDto getAdminDashBoard(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        long totalUser = getUserTotal();
        Map<String, Long> transactionsToday = getTotalTransactionsToday();
        long totalTransactions = transactionsToday.values().stream().mapToLong(Long::longValue).sum();

        long depositPerDay = transactionsToday.getOrDefault("Deposit", 0L);
        long instantTransferPerDay = transactionsToday.getOrDefault("Instant Transfer", 0L);
        long overseaTransferPerDay = transactionsToday.getOrDefault("Oversea Transfer", 0L);

        Map<String, Long> userTiersCount = getUserTiersCount();
        long silverCount = userTiersCount.getOrDefault("Silver Snitch" , 0L);
        long goldCount = userTiersCount.getOrDefault("Golden Galleon", 0L);
        long platinumCount = userTiersCount.getOrDefault("Platinum Patronus", 0L);

        return new AdminDashboardDto(
                user.name(),
                user.age(),
                user.accountId(),
                user.dateOfBirth(),
                user.email(),
                user.availableAmount(),
                user.userTier(),
//                user.dailyLimit(),
//                user.maxLimitPerTransfer(),
                totalUser,
                totalTransactions
//                depositPerDay,
//                instantTransferPerDay,
//                overseaTransferPerDay,
//                silverCount,
//                goldCount,
//                platinumCount
        );
    }

    public Map<String, Long> getUserTiersCount() {
        MongoCollection<Document> collection = mongoClient.getDatabase("bank-api-db").getCollection("userInfo");

        // Correcting the field name to "userTier" for the aggregation
        List<Bson> aggregationStages = List.of(
                Aggregates.group("$userTier", Accumulators.sum("count", 1))  // Grouping documents by 'userTier' field
        );

        // Execute the aggregation
        AggregateIterable<Document> result = collection.aggregate(aggregationStages);

        Map<String, Long> tiersCount = new HashMap<>();
        for (Document doc : result) {
            String tierName = doc.getString("_id"); // _id holds the tier name as it's the grouping key
            Number count = doc.get("count", Number.class); // 'count' is the number of users in this tier
            tiersCount.put(tierName, count.longValue());
        }

        return tiersCount;
    }


    public long getUserTotal() {
        return userRepository.count();
    }

    public Map<String, Long> getTotalTransactionsToday() {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDateTime startOfDay = today.atStartOfDay(ZoneOffset.UTC).toLocalDateTime();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX).atZone(ZoneOffset.UTC).toLocalDateTime();

        // Convert LocalDateTime to Date for MongoDB
        Date startDate = Date.from(startOfDay.toInstant(ZoneOffset.UTC));
        Date endDate = Date.from(endOfDay.toInstant(ZoneOffset.UTC));

        // Match transactions within the date range
        MatchOperation matchOperation = Aggregation.match(
                Criteria.where("transactions.dateTime").gte(startDate).lt(endDate)
        );

        // Unwind transactions array
        UnwindOperation unwindOperation = Aggregation.unwind("transactions");

        // Match the transaction date again after unwinding
        MatchOperation matchTransactionDate = Aggregation.match(
                Criteria.where("transactions.dateTime").gte(startDate).lt(endDate)
        );

        // Group by transactionId to ensure each transaction is counted once
        GroupOperation groupByTransactionId = group("transactions.transactionId")
                .first("transactions.type").as("type");

        // Group by type and count
        GroupOperation groupByType = group("type").count().as("total");

        // Project the results to a more readable format
        ProjectionOperation projectionOperation = Aggregation.project("total")
                .and("_id").as("transactionType");

        // Build aggregation
        Aggregation aggregation = Aggregation.newAggregation(
                matchOperation,
                unwindOperation,
                matchTransactionDate,
                groupByTransactionId,
                groupByType,
                projectionOperation
        );

        // Execute aggregation
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "userInfo", Document.class);

        // Process the results into a map
        Map<String, Long> transactionCounts = new HashMap<>();
        for (Document document : results.getMappedResults()) {
            String transactionType = document.getString("transactionType");
            Number count = document.get("total", Number.class);
            transactionCounts.put(transactionType, count.longValue());
        }

        return transactionCounts;
    }

    public void changeUserPassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        Update update = new Update();
        update.set("password", encodedPassword);
        Query query = new Query(Criteria.where("id").is(user.id()));
        mongoTemplate.updateFirst(query, update, User.class);
    }
}