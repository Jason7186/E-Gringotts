package com.egringotts.egringotts.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "chatHistory")
public class ChatHistory {
    @Id
    String accountId;
    List<AIQnA> QnA;
}