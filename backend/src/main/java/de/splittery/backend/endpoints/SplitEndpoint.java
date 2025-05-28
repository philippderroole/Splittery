package de.splittery.backend.endpoints;

import de.splittery.backend.dtos.SplitDto;
import de.splittery.backend.endpoints.exceptions.NotFoundException;
import de.splittery.backend.mappers.SplitMapper;
import de.splittery.backend.repositories.SplitRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;

@RestController
public class SplitEndpoint {

    @Autowired
    private SplitRepository splitRepository;

    @Autowired
    private SplitMapper splitMapper;

    /**
     * Creates a new Split and assigns a unique id. <br>
     * <p>
     * {@link SplitDto#getId()} needs to be {@code null}.
     * {@link SplitDto#getUsers()} need to be empty or {@code null}.
     */
    @PostMapping("/splits")
    public SplitDto createSplit(@RequestBody SplitDto splitDto) throws BadRequestException {
        if (splitDto.getId() != null) {
            throw new BadRequestException();
        }

        if (!CollectionUtils.isEmpty(splitDto.getUsers())) {
            throw new BadRequestException();
        }

        return splitMapper.toDto(splitRepository.save(splitMapper.toEntity(splitDto)));
    }

    @GetMapping("/splits/{id}")
    public SplitDto getSplit(@PathVariable long id) throws NotFoundException {
        return splitMapper.toDto(splitRepository.findSplitById(id).orElseThrow(NotFoundException::new));
    }

    @GetMapping("/splits")
    public Collection<SplitDto> getAllSplits() throws NotFoundException {
        return splitRepository.findAll().stream().map(splitMapper::toDto).toList();
    }

    @PutMapping("/splits/{id}")
    public SplitDto updateSplit(@PathVariable long id, @RequestBody SplitDto splitDto) throws NotFoundException, BadRequestException {
        if (!Objects.equals(id, splitDto.getId())) {
            throw new BadRequestException();
        }

        splitRepository.findSplitById(id).orElseThrow(NotFoundException::new);

        return splitMapper.toDto(splitRepository.save(splitMapper.toEntity(splitDto)));
    }

    @DeleteMapping("/splits/{id}")
    public void deleteSplit(@PathVariable long id) throws NotFoundException {
        splitRepository.findSplitById(id).orElseThrow(NotFoundException::new);

        splitRepository.deleteById(id);
    }
}
