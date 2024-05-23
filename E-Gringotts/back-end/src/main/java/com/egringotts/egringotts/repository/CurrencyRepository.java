package com.egringotts.egringotts.repository;

import com.egringotts.egringotts.entity.CurrencyDocument;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRepository extends MongoRepository<CurrencyDocument, String> {
    Optional<CurrencyDocument> findByBaseCurrency(String name);
}