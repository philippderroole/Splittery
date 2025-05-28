package de.splittery.backend.endpoints;

import de.splittery.backend.dtos.SplitUserDto;
import de.splittery.backend.endpoints.exceptions.BadRequestException;
import de.splittery.backend.endpoints.exceptions.NotFoundException;
import de.splittery.backend.enitities.SplitUser;
import de.splittery.backend.mappers.SplitUserMapper;
import de.splittery.backend.repositories.SplitUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.stream.Stream;

@RestController
public class SplitUserEndpoint {

    @Autowired
    private SplitUserRepository splitUserRepository;

    @Autowired
    private SplitUserMapper splitUserMapper;

    @PostMapping("/splits/{splitId}/users")
    public SplitUserDto createUser(@PathVariable long splitId, @RequestBody SplitUserDto splitUserDto) throws BadRequestException {
        if (!Objects.equals(splitId, splitUserDto.getSplit())) {
            throw new BadRequestException();
        }

        return splitUserMapper.toDto(splitUserRepository.save(splitUserMapper.toEntity(splitUserDto)));
    }

    @GetMapping("/splits/{splitId}/users/{id}")
    public SplitUserDto getUser(@PathVariable long splitId, @PathVariable long id) throws NotFoundException {
        SplitUser splitUser = splitUserRepository.findSplitUserBySplitIdAndId(splitId, id).orElseThrow(NotFoundException::new);

        return splitUserMapper.toDto(splitUser);
    }

    @GetMapping("/splits/{splitId}/users")
    public Stream<SplitUserDto> getAllUsers(@PathVariable long splitId) {
        return splitUserRepository.findAllBySplitId(splitId).stream().map(splitUserMapper::toDto);
    }

    @PutMapping("/splits/{splitId}/users/{id}")
    public SplitUserDto updateUser(@PathVariable long splitId, @PathVariable long id, @RequestBody SplitUserDto splitUserDto) throws NotFoundException, BadRequestException {
        if (!Objects.equals(id, splitUserDto.getId())) {
            throw new BadRequestException();
        }

        splitUserRepository.findSplitUserBySplitIdAndId(splitId, id).orElseThrow(NotFoundException::new);

        SplitUser splitUser = splitUserMapper.toEntity(splitUserDto);

        return splitUserMapper.toDto(splitUserRepository.save(splitUser));
    }

    @DeleteMapping("/splits/{splitId}/users/{id}")
    public void deleteUser(@PathVariable long splitId, @PathVariable long id) throws NotFoundException {
        splitUserRepository.findSplitUserBySplitIdAndId(splitId, id).orElseThrow(NotFoundException::new);

        splitUserRepository.deleteById(id);
    }
}
