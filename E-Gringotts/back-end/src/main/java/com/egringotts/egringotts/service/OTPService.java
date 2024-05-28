package com.egringotts.egringotts.service;

import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.bson.Document;
import org.jboss.aerogear.security.otp.Totp;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {
    private final MongoTemplate mongoTemplate;

    public OTPService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
        ensureIndexes(); // Ensure TTL index is created when the service is instantiated
    }

    private void ensureIndexes() {
        IndexOptions indexOptions = new IndexOptions().expireAfter(5L, TimeUnit.MINUTES); // Set TTL for 5 minutes
        mongoTemplate.getCollection("OTPTempStorage").createIndex(Indexes.ascending("timestamp_1"), indexOptions);
    }

    public void storeOTPData(String email, String secret) {
        Document otpData = new Document();
        otpData.put("email", email);
        otpData.put("secret", secret);
        otpData.put("timestamp_1", new Date()); // Timestamp to manage TTL

        mongoTemplate.save(otpData, "OTPTempStorage");
    }

    public boolean validateOTP(String email, String userProvidedCode) {
        String secret = getSecretByEmail(email);
        System.out.println("DB secret : " + secret);
        if (secret == null) {
            return false;  // Secret not found, or OTP is expired
        }

        Totp totp = new Totp(secret);
        System.out.println(totp);
        return totp.verify(userProvidedCode);
    }
    public String getSecretByEmail(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        Document otpData = mongoTemplate.findOne(query, Document.class, "OTPTempStorage");
        return otpData != null ? otpData.getString("secret") : null;
    }

    public void deleteOTP(String email) {
        Query query = new Query(Criteria.where("email").is(email));
        mongoTemplate.remove(query, "OTPTempStorage");
    }
}
