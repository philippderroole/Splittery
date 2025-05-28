package de.splittery.backend.repositories;

import de.splittery.backend.enitities.Transaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long> {
    Transaction getTransactionById(long id);

    Optional<Transaction> findTransactionById(long id);

    Collection<Transaction> getTransactionsByIdIsIn(Collection<Long> ids);

    Collection<Transaction> getTransactionsBySplitId(long ids);

    Optional<Transaction> findTransactionBySplitIdAndId(Long splitId, Long id);
}
