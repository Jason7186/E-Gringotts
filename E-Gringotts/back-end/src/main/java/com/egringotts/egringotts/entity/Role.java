package com.egringotts.egringotts.entity;

import lombok.Getter;

import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document
public class Role {
    @Id
    private String id;
    private String name;

    public Role(String name) {
        this.name = name;
    }
}
