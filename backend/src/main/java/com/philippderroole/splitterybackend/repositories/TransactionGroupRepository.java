package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.TransactionGroup;
import com.philippderroole.splitterybackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionGroupRepository extends JpaRepository<TransactionGroup, String> {
}
