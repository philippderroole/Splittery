package de.splittery.backend.repositories;

import de.splittery.backend.enitities.SplitUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SplitUserRepository extends CrudRepository<SplitUser, Long> {

    Optional<SplitUser> findUserById(long id);

    Optional<SplitUser> findSplitUserBySplitIdAndId(long splitId, long id);

    Streamable<SplitUser> getUsersBySplitId(long splitId);

    Streamable<SplitUser> findAllBySplitId(long splitId);
}
