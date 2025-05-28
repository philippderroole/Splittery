package de.splittery.backend.mappers;

import de.splittery.backend.dtos.SplitDto;
import de.splittery.backend.enitities.Split;
import de.splittery.backend.enitities.SplitUser;
import de.splittery.backend.repositories.SplitUserRepository;
import de.splittery.backend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

@Component
public class SplitMapper implements Mapper<SplitDto, Split> {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SplitUserRepository splitUserRepository;

    public Split toEntity(SplitDto splitDto) {
        Split split = new Split();
        split.setId(splitDto.getId());
        split.setName(splitDto.getName());
        split.setUsers(ofNullable(splitDto.getId())
                .map(splitUserRepository::getUsersBySplitId)
                .orElse(Streamable.empty())
                .toList());
        return split;
    }

    public SplitDto toDto(Split split) {
        SplitDto splitDto = new SplitDto();
        splitDto.setId(split.getId());
        splitDto.setName(split.getName());
        splitDto.setUsers(split.getUsers().stream()
                .map(SplitUser::getId)
                .collect(Collectors.toList()));
        return splitDto;
    }
}
