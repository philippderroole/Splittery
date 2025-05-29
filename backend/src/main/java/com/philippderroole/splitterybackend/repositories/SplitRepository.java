package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SplitRepository extends JpaRepository<Split, String> {
}
