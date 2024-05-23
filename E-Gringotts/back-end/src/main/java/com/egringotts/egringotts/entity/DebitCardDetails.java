package com.egringotts.egringotts.entity;


import com.mongodb.client.*;
import lombok.Getter;
import lombok.Setter;
import org.bson.Document;

import java.time.LocalDate;

@Getter
@Setter
public class DebitCardDetails {
    private String debitCardNumber;
    private LocalDate debitExpiryDate;
    private String cvv;
    private double debitCardLimit;

    public DebitCardDetails() {
        int randomCVV = (int) (Math.random() * 1000);
        this.cvv = String.format("%03d",randomCVV);
        this.debitExpiryDate = LocalDate.now().plusYears(5);
        this.debitCardNumber = cardNumGenerator();
        this.debitCardLimit = 1000;
    }

    private String cardNumGenerator() {
        MongoClient mongoClient = MongoClients.create("mongodb+srv://hongyu6776:7mmmVc7f29pacg5r@bankinfo.vntebxz.mongodb.net/");
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with credit card details
        FindIterable<Document> result = collection.find().sort(new Document("debitCardDetail.debitCardNumber", -1)).limit(1);

        // Extract the card number from the user document
        String lastCardNumber = "1688000010000000"; // Default to the starting sequence if no cards are found
        for (Document doc : result) {
            Document debitCardDetails = (Document) doc.get("debitCardDetails");
            if (debitCardDetails != null && debitCardDetails.getString("debitCardNumber") != null) {
                lastCardNumber = debitCardDetails.getString("debitCardNumber");
                break;
            }
        }

        // Increment the last card number by 2
        long newCardNumber = Long.parseLong(lastCardNumber) + 1;

        mongoClient.close();
        return String.format("%016d", newCardNumber);
    }
}
