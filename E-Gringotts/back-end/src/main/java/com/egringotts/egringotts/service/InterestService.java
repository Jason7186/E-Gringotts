package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterestService {

    private MongoTemplate mongoTemplate;

    public InterestService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    private static final double silverSnitchRate = 0.02;
    private static final double goldenGalleonRate = 0.03;
    private static final double platinumPatronusRate = 0.04;


    @Scheduled(cron = "0 0 0 * * ?") // This cron expression means the task will run daily at midnight/
    public void applyDailyInterest() throws Exception {
        applyInterest();
    }


    public void applyInterest() {
        List<User> users = mongoTemplate.findAll(User.class);

        for (User user : users) {
            double availableAmount = user.availableAmount();
            double interestRate = getInterestRate(availableAmount);
            double dailyInterest = availableAmount * (interestRate / 365);

            double newAvailableAmount = availableAmount + dailyInterest;

            String newTier = getUserTier(newAvailableAmount);

            Query query = new Query(Criteria.where("id").is(user.id()));
            Update update = new Update().set("availableAmount" ,newAvailableAmount).set("userTier", newTier).set("dailyAvailableLimit", user.dailyLimit());
            mongoTemplate.updateFirst(query, update, User.class);
        }
    }

    private double getInterestRate(double availableAmount) {
        if (availableAmount >= 10000) {
            return platinumPatronusRate;
        } else if (availableAmount >= 3000) {
            return goldenGalleonRate;
        } else {
            return silverSnitchRate;
        }
    }

    private String getUserTier(double availableAmount) {
        if (availableAmount >= 10000) {
            return "Platinum Patronus";
        } else if (availableAmount >= 3000) {
            return "Golden Galleon";
        } else {
            return "Silver Snitch";
        }
    }
}
