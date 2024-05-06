package com.egringotts.egringotts;

import com.mongodb.client.*;
import org.bson.Document;

import java.time.LocalDate;

public class DebitCardDetails {
    private final String debitCardNumber;
    private final LocalDate debitExpiryDate;
    private final String cvv;

    public DebitCardDetails() {
        int randomCVV = (int) (Math.random() * 1000);
        this.cvv = String.format("%03d",randomCVV);
        this.debitExpiryDate = LocalDate.now().plusYears(5);
        this.debitCardNumber = cardNumGenerator();
    }

    private String cardNumGenerator() {
        MongoClient mongoClient = MongoClients.create("mongodb+srv://<username>:<password>@<cluster-address>/");
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with credit card details
        FindIterable<Document> result = collection.find().sort(new Document("creditCardDetails.cardNumber", -1)).limit(1);

        // Extract the card number from the user document
        String lastCardNumber = "1688000000000000"; // Default to the starting sequence if no cards are found
        for (Document doc : result) {
            Document debitCardDetails = (Document) doc.get("debitCardDetails");
            if (debitCardDetails != null && debitCardDetails.getString("cardNumber") != null) {
                lastCardNumber = debitCardDetails.getString("cardNumber");
                break;
            }
        }

        // Increment the last card number by 2
        long newCardNumber = Long.parseLong(lastCardNumber) + 2;

        mongoClient.close();

        return String.format("%016d", newCardNumber);
    }
}
