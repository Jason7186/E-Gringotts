package com.egringotts.egringotts.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class AdminDashboardDto {
    private String name;
    private int age;
    private String accountId;
    private LocalDate dateOfBirth;
    private String email;
    private double availableAmount;
    private String userTier;
    private long userTotalNum;
    private long transactionsTotalPerDay;
    private long depositPerDay;
    private long instantTransferPerDay;
    private long overseaTransferPerDay;
    private long silverCount;
    private long goldCount;
    private long platinumCount;
}