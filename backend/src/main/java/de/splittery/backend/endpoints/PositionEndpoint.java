package de.splittery.backend.endpoints;

import de.splittery.backend.dtos.PositionDto;
import de.splittery.backend.mappers.PositionMapper;
import de.splittery.backend.repositories.PositionRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class PositionEndpoint {

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private PositionMapper positionMapper;

    @PostMapping("/position")
    public PositionDto createSplit(@RequestBody PositionDto positionDto) {
        return positionMapper.toDto(positionRepository.save(positionMapper.toEntity(positionDto)));
    }

    @GetMapping("/position/{id}")
    public PositionDto getSplit(@PathVariable long id) {
        return positionMapper.toDto(positionRepository.getPositionById(id));
    }

    @PutMapping("/position")
    public PositionDto updateSplit(PositionDto positionDto) throws BadRequestException {
        if (!positionRepository.existsById(positionDto.getId())) {
            throw new BadRequestException();
        }

        return positionMapper.toDto(positionRepository.save(positionMapper.toEntity(positionDto)));
    }

    @DeleteMapping("/position")
    public void deleteSplit(PositionDto positionDto) throws BadRequestException {
        if (!positionRepository.existsById(positionDto.getId())) {
            throw new BadRequestException();
        }

        positionRepository.deleteById(positionDto.getId());
    }
}
