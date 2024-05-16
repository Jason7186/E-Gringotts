package com.egringotts.egringotts;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "currencies")
public record Currency(
        @Id
        String id,
        String currencyName,
        double conversionRateToGalleon
) {}
