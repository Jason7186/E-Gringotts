package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.CurrencyDocument;
import com.egringotts.egringotts.entity.CurrencyGraph;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class CurrencyService {

    private final MongoTemplate mongoTemplate;
    private CurrencyGraph currencyGraph;

    public CurrencyService (MongoTemplate mongoTemplate) {
        this.currencyGraph = new CurrencyGraph();
        this.mongoTemplate = mongoTemplate;
    }

    // Method to add currency and rate
    public void addCurrencyWithRate(String fromCurrency, String toCurrency, double rate) {
        // Update in-memory graph
        currencyGraph.addCurrency(fromCurrency);
        currencyGraph.addCurrency(toCurrency);
        currencyGraph.addRate(fromCurrency, toCurrency, rate);

        // Update MongoDB
        saveOrUpdateRate(fromCurrency, toCurrency, rate);
        if (!fromCurrency.equals(toCurrency)) {
            saveOrUpdateRate(toCurrency, fromCurrency, 1 / rate);
        }
    }

    // Saves or updates the rate in MongoDB
    private void saveOrUpdateRate(String baseCurrency, String targetCurrency, double rate) {
        CurrencyDocument document = mongoTemplate.findById(baseCurrency, CurrencyDocument.class, "currencies");
        if (document == null) {
            document = new CurrencyDocument();
            document.setBaseCurrency(baseCurrency);
            document.setRates(new HashMap<>());
        }
        document.getRates().put(targetCurrency, rate);
        mongoTemplate.save(document, "currencies");
    }

    public double convertCurrency(String fromCurrency, String toCurrency, double amount) {
        CurrencyDocument currency = mongoTemplate.findById(fromCurrency, CurrencyDocument.class);
        if (currency == null || !currency.getRates().containsKey(toCurrency)) {
            throw new IllegalArgumentException("Currency conversion rate not found.");
        }
        return amount * currency.getRates().get(toCurrency);
    }
}
