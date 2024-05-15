package com.egringotts.egringotts;

import com.mongodb.client.*;
import lombok.Getter;
import org.bson.Document;
import java.time.LocalDate;

@Getter
public class CreditCardDetails {
    private final String creditCardNumber;
    private final LocalDate creditExpiryDate;
    private final String cvv;

    public CreditCardDetails() {
        this.creditCardNumber = cardNumGenerator();
        int randomCVV = (int) (Math.random() * 1000);
        this.cvv = String.format("%03d", randomCVV);
        this.creditExpiryDate = LocalDate.now().plusYears(5);
    }

    private String cardNumGenerator() {
        MongoClient mongoClient = MongoClients.create("mongodb+srv://<username>:<password>@<cluster-address>/");
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with credit card details
        FindIterable<Document> result = collection.find().sort(new Document("creditCardDetails.cardNumber", -1)).limit(1);

        // Extract the card number from the user document
        String lastCardNumber = "1688000000000001"; // Default to the starting sequence if no cards are found
        for (Document doc : result) {
            Document creditCardDetails = (Document) doc.get("creditCardDetails");
            if (creditCardDetails != null && creditCardDetails.getString("cardNumber") != null) {
                lastCardNumber = creditCardDetails.getString("cardNumber");
                break;
            }
        }

        // Increment the last card number by 2
        long newCardNumber = Long.parseLong(lastCardNumber) + 2;

        mongoClient.close();

        return String.format("%016d", newCardNumber);
    }

}
