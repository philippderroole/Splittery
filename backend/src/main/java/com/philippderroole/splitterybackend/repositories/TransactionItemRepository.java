package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionItemRepository extends JpaRepository<TransactionItem, String> {
}
