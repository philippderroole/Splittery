package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionItemRepository extends JpaRepository<TransactionItem, String> {
    Optional<TransactionItem> findByUrl(String itemUrl);
}
