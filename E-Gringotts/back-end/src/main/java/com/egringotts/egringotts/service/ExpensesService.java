package com.egringotts.egringotts.service;

import com.egringotts.egringotts.controller.UserController;
import com.egringotts.egringotts.entity.Transaction;
import com.egringotts.egringotts.entity.User;
import com.egringotts.egringotts.repository.UserRepository;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.UnwindOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ExpensesService {
    private final MongoTemplate mongoTemplate;
    private final UserController userController;
    private final UserRepository userRepository;

    public List<List<Transaction>> getExpensesByCategories(String startDateStr, String endDateStr) {
        // Get login user id
        String currentUserAccId = userController.getLoggedInUser().accountId();

        // List for all categories
        List<AggregationOperation> fundTransfer = new ArrayList<>();
        List<AggregationOperation> foodAndBeverage = new ArrayList<>();
        List<AggregationOperation> transportation = new ArrayList<>();
        List<AggregationOperation> entertainment = new ArrayList<>();
        List<AggregationOperation> housing = new ArrayList<>();
        List<AggregationOperation> medical = new ArrayList<>();
        List<AggregationOperation> social = new ArrayList<>();
        List<AggregationOperation> generalGoods = new ArrayList<>();
        List<AggregationOperation> magicalItems = new ArrayList<>();
        List<AggregationOperation> others = new ArrayList<>();

        // Array for all categories
        String [] category = {"Fund Transfer","Food and Beverage","Transportation",
                    "Entertainment","Housing","Medical","Social",
                "General Goods","Magical Items","Others"};

        // Array for all list of categories
        @SuppressWarnings("unchecked")
        List<AggregationOperation> [] obj = new List[] {
                fundTransfer,foodAndBeverage,transportation,
                entertainment,housing,medical,social,
                generalGoods, magicalItems,others
        };

        // Create list to store every list of categories
        List<List<Transaction>> operations = new ArrayList<>();

        MatchOperation matchUser = Aggregation.match(Criteria.where("accountId").is(currentUserAccId));
        addObject(obj,matchUser);

        // Unwind the transactions
        UnwindOperation unwindTransactions = Aggregation.unwind("transactions");
        addUnwindTransactions(obj,unwindTransactions);

        // Replace root all list with transaction
        AggregationOperation replaceRootWithTransaction = context -> new Document("$replaceRoot", new Document("newRoot", "$transactions"));
        replaceRoot(obj,replaceRootWithTransaction);

        // Check need to filter date range or not
        if (startDateStr != null && !startDateStr.isEmpty() && endDateStr != null && !endDateStr.isEmpty()) {
            Date startDate = Date.from(LocalDate.parse(startDateStr).atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(LocalDate.parse(endDateStr).plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
            MatchOperation matchDateRange = Aggregation.match(Criteria.where("dateTime").gte(startDate).lte(endDate));
            addObject(obj,matchDateRange);
        }

        // Filter out the received transaction
        MatchOperation matchAmount = Aggregation.match(Criteria.where("amount").lt(0));
        addObject(obj,matchAmount);

        // Sort the category to their own list
        addMatchObject(category,obj);


        // Add every category lists to operation list
        for (List<AggregationOperation> i : obj)
            operations.add(buildAggregation(i));

        return operations;
    }

    public void replaceRoot(List<AggregationOperation> [] obj, AggregationOperation replace) {
        for (List<AggregationOperation> i : obj)
            i.add(replace);
    }

    public void addUnwindTransactions(List<AggregationOperation> [] obj, UnwindOperation unwindOperation) {
        for (List<AggregationOperation> i : obj)
            i.add(unwindOperation);
    }

    public void addObject(List<AggregationOperation> [] obj, MatchOperation matchOperation) {
        for (List<AggregationOperation> i : obj)
            i.add(matchOperation);
    }

    public void addMatchObject(String [] categories, List<AggregationOperation> [] obj) {
        for (int i = 0; i < categories.length; i++) {
            MatchOperation matchCategory = Aggregation.match(Criteria.where("category").is(categories[i]));
            obj[i].add(matchCategory);
        }
    }

    public List<Transaction> buildAggregation(List<AggregationOperation> obj) {
        Aggregation aggregation = Aggregation.newAggregation(obj);
        return mongoTemplate.aggregate(aggregation,"userInfo",Transaction.class).getMappedResults();
    }

}
