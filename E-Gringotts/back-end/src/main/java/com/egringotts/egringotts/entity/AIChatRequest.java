package com.egringotts.egringotts.entity;

import lombok.Data;

import java.util.ArrayList;

@Data
public class AIChatRequest {
    private String model;
    public ArrayList<Message> messages = new ArrayList<>();

    public AIChatRequest(String model, String prompt) {
        this.model = model;
        this.messages.add(new Message("user",prompt));
    }
}
