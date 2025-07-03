package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByUrl(String transactionUrl);
}
