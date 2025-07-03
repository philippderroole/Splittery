package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import org.springframework.stereotype.Service;

import static com.philippderroole.splitterybackend.entities.Split.URL_LENGTH;

@Service
public final class SplitService {
    private final SplitRepository splitRepository;
    private final ValidationService validationService;

    public SplitService(SplitRepository splitRepository, ValidationService validationService) {
        this.splitRepository = splitRepository;
        this.validationService = validationService;
    }

    public Split createSplit(CreateSplitDto splitDto) {
        Split split = new Split();
        split.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        split.setName(splitDto.getName());

        return splitRepository.save(split);
    }

    public Split getSplit(String splitUrl) {
        return validationService.findSplitByUrl(splitUrl);
    }

    public Split updateSplit(String splitUrl, CreateSplitDto splitDto) {
        Split split = validationService.findSplitByUrl(splitUrl);

        split.setName(splitDto.getName());

        return splitRepository.save(split);
    }
}
