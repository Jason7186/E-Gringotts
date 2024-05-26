package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;
@Setter
@Getter
@Document(collection = "currencies")
public class CurrencyDocument {
    @Id
    private String baseCurrency;
    private Map<String, Double> rates;

    public CurrencyDocument() {
    }

    public CurrencyDocument(String baseCurrency, Map<String, Double> rates) {
        this.baseCurrency = baseCurrency;
        this.rates = rates;
    }

}
