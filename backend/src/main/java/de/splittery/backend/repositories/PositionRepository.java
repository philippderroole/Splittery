package de.splittery.backend.repositories;

import de.splittery.backend.enitities.Position;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface PositionRepository extends CrudRepository<Position, Long> {

    @Query("select p from Position p where p.id in :ids")
    Collection<Position> findPositionsByIds(Collection<Long> ids);

    Position getPositionById(Long id);
}
