package de.splittery.backend.mappers;

import de.splittery.backend.dtos.SplitUserDto;
import de.splittery.backend.enitities.SplitUser;
import de.splittery.backend.repositories.SplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SplitUserMapper implements Mapper<SplitUserDto, SplitUser> {

    @Autowired
    private SplitRepository splitRepository;

    public SplitUser toEntity(SplitUserDto splitUserDto) {
        SplitUser splitUser = new SplitUser();
        splitUser.setId(splitUserDto.getId());
        splitUser.setName(splitUserDto.getName());
        splitUser.setSplit(splitRepository.findSplitById(splitUserDto.getSplit()).orElseThrow());
        return splitUser;
    }

    public SplitUserDto toDto(SplitUser splitUser) {
        SplitUserDto splitUserDto = new SplitUserDto();
        splitUserDto.setId(splitUser.getId());
        splitUserDto.setName(splitUser.getName());
        splitUserDto.setSplit(splitUser.getSplit().getId());
        return splitUserDto;
    }
}
