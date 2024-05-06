package com.egringotts.egringotts;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;


@Document(collection = "userInfo")
public record User(
        @Id
        String id,
        String name,
        int age,
        String accountId,
        LocalDate dateOfBirth,
        String email,
        String password,
        int availableAmount,
        String userTier,
        String securityPin,
        DebitCardDetails debitCardDetails,
        CreditCardDetails creditCardDetails,
        List<Transaction> transactions
) {}