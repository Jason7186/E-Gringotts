package com.egringotts.egringotts.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Transaction {
    private String transactionId;
    private LocalDateTime dateTime;
    private Double amount;
    private String type;
    private String sender;
    private String senderId;
    private String receiver;
    private String receiverId;
    private String category;
    private String details;


    public Transaction(Double amount, String type, String sender, String senderId, String receiver, String receiverId, String category, String details) {
        this.transactionId = UUID.randomUUID().toString();
        this.dateTime = LocalDateTime.now();
        this.amount = amount;
        this.type = type;
        this.sender = sender;
        this.senderId = senderId;
        this.receiver = receiver;
        this.receiverId = receiverId;
        this.category = category;
        this.details = details;
    }
}
