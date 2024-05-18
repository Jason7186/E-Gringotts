package com.egringotts.egringotts.repository;

import com.egringotts.egringotts.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByAccountId(String accountId);
    Optional<User> findByEmail(String email);

}
