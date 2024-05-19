package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OverseaTransferRequest {
    private String receiverAccountId;
    private Double amount;
    private String category;
    private String transactionDetails;
    private String baseCurrency;
    private String toCurrency;
}
