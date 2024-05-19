package com.egringotts.egringotts.entity;


import com.mongodb.client.*;
import lombok.Getter;
import lombok.Setter;
import org.bson.Document;
import java.time.LocalDate;

@Getter
@Setter
public class CreditCardDetails {
    private String creditCardNumber;
    private LocalDate creditExpiryDate;
    private String cvv;

    public CreditCardDetails() {
        this.creditCardNumber = cardNumGenerator();
        int randomCVV = (int) (Math.random() * 1000);
        this.cvv = String.format("%03d", randomCVV);
        this.creditExpiryDate = LocalDate.now().plusYears(5);
    }

    private String cardNumGenerator() {
        MongoClient mongoClient = MongoClients.create("mongodb+srv://hongyu6776:7mmmVc7f29pacg5r@bankinfo.vntebxz.mongodb.net/\n");
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with credit card details
        FindIterable<Document> result = collection.find().sort(new Document("creditCardDetails.creditCardNumber", -1)).limit(1);

        // Extract the card number from the user document
        String lastCardNumber = "1688000000000001"; // Default to the starting sequence if no cards are found
        for (Document doc : result) {
            Document creditCardDetails = (Document) doc.get("creditCardDetails");
            if (creditCardDetails != null && creditCardDetails.getString("creditCardNumber") != null) {
                lastCardNumber = creditCardDetails.getString("creditCardNumber");
                break;
            }
        }

        // Increment the last card number by 2
        long newCardNumber = Long.parseLong(lastCardNumber) + 1;

        mongoClient.close();

        return String.format("%016d", newCardNumber);
    }

}
