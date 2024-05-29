package com.egringotts.egringotts.repository;


import com.egringotts.egringotts.entity.ChatHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatHistoryRepository extends MongoRepository<ChatHistory, String> {
    Optional<ChatHistory> findByAccountId(String accountId);
}