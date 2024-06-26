package com.egringotts.egringotts.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class UserDashboardDto {
    private String name;
    private int age;
    private String accountId;
    private LocalDate dateOfBirth;
    private String email;
    private double availableAmount;
    private String userTier;
    private double limitPerDay;
    private double limitPerTransactions;
}
