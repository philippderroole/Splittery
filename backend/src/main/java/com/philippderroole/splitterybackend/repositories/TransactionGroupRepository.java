package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.TransactionGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionGroupRepository extends JpaRepository<TransactionGroup, String> {
    Optional<TransactionGroup> findByUrl(String transactionUrl);
}
