package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepositRequest {
    private Double amount;
    private String securityPin;
}
