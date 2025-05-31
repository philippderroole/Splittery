package com.philippderroole.splitterybackend.repositories;

import com.philippderroole.splitterybackend.entities.Split;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SplitRepository extends JpaRepository<Split, String> {
    Optional<Split> findByUrl(String url);
}
