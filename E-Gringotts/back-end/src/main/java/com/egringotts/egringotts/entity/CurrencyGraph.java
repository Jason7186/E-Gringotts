package com.egringotts.egringotts.entity;

import java.util.HashMap;
import java.util.Map;

public class CurrencyGraph {
    private Map<String, Map<String, Double>> adjacencyList;

    public CurrencyGraph() {
        this.adjacencyList = new HashMap<>();
    }

    // Adds currency to the graph
    public void addCurrency(String currency) {
        adjacencyList.putIfAbsent(currency, new HashMap<>());
    }

    // Adds or updates a conversion rate
    public void addRate(String fromCurrency, String toCurrency, double rate) {
        adjacencyList.get(fromCurrency).put(toCurrency, rate);
        if (!fromCurrency.equals(toCurrency)) {
            adjacencyList.get(toCurrency).put(fromCurrency, 1 / rate);
        }
    }

    public Map<String, Map<String, Double>> getAdjacencyList() {
        return adjacencyList;
    }
}
