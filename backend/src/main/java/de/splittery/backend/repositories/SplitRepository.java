package de.splittery.backend.repositories;

import de.splittery.backend.enitities.Split;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface SplitRepository extends CrudRepository<Split, Long> {
    Optional<Split> findSplitById(long id);

    Collection<Split> getSplitByIdIsIn(Collection<Long> ids);

    Streamable<Split> findAll();
}
