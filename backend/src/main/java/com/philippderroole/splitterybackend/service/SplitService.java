package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.dtos.SplitDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.philippderroole.splitterybackend.entities.Split.URL_LENGTH;

@Service
public class SplitService {

    @Autowired
    private SplitRepository splitRepository;

    public SplitDto getSplit(String splitUrl) {
        Split split = splitRepository.findByUrl((splitUrl))
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        return SplitDto.from(split);
    }

    public SplitDto createSplit(CreateSplitDto createSplitDto) {
        Split split = new Split();
        split.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        split.setName(createSplitDto.getName());

        split = splitRepository.save(split);

        return SplitDto.from(split);
    }
}
