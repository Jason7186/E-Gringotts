package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Friend {
    private String name;
    private String accountId;

    public Friend(String name, String accountId) {
        this.name = name;
        this.accountId = accountId;
    }
}
