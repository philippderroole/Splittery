package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.dtos.SplitDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.UUID;

@Service
public class SplitService {

    @Autowired
    private SplitRepository splitRepository;

    public SplitDto getSplit(String splitId) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        return SplitDto.from(split);
    }

    public SplitDto createSplit(CreateSplitDto createSplitDto) {
        Split split = new Split();
        split.setUrl(generateUrl(Split.URL_LENGTH));
        split.setName(createSplitDto.getName());

        split = splitRepository.save(split);

        return SplitDto.from(split);
    }

    /**
     * Generates a unique Base64 that is safe for use in URLs.
     */
    private String generateUrl(int length) {
        UUID uuid = UUID.randomUUID();
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(uuid.toString().getBytes())
                .substring(0, length);
    }
}
