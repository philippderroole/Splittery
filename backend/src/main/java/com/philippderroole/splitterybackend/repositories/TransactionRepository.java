package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByUrl(String transactionUrl);

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.items WHERE t.id = :id")
    Optional<Transaction> findByIdWithItems(@Param("id") String id);
}
