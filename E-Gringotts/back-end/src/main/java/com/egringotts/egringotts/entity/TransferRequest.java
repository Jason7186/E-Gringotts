package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TransferRequest {
    private String receiverAccountId;
    private Double amount;
    private String category;
    private String transactionDetails;
    private String securityPin;
}