package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIQnA {
    private String role;
    private String content;

    public AIQnA(String role, String content) {
        this.role = role;
        this.content = content;
    }
}
