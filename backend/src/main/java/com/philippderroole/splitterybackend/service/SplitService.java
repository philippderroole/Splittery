package com.philippderroole.splitterybackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.dtos.user.AddUserDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.User;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.UserRepository;
import com.philippderroole.splitterybackend.responsebuilders.SplitResponseBuilder;
import org.springframework.stereotype.Service;

import static com.philippderroole.splitterybackend.entities.Split.URL_LENGTH;

@Service
public class SplitService {

    private final SplitRepository splitRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    public SplitService(SplitRepository splitRepository, ObjectMapper objectMapper, UserRepository userRepository) {
        this.splitRepository = splitRepository;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
    }

    public ObjectNode getSplit(String splitUrl) {
        Split split = splitRepository.findByUrl((splitUrl))
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        return SplitResponseBuilder.create(objectMapper)
                .showUsers()
                .build(split);
    }

    public ObjectNode createSplit(CreateSplitDto createSplitDto) {
        Split split = new Split();
        split.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        split.setName(createSplitDto.getName());

        return SplitResponseBuilder.create(objectMapper)
                .showUsers()
                .build(splitRepository.save(split));
    }

    public ObjectNode updateSplit(String splitUrl, CreateSplitDto createSplitDto) {
        Split split = splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        split.setName(createSplitDto.getName());

        return SplitResponseBuilder.create(objectMapper)
                .showUsers()
                .build(splitRepository.save(split));
    }

    public ObjectNode addUser(String splitUrl, AddUserDto addUserDto) {
        Split split = splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        User user = new User();
        user.setUsername(addUserDto.getUsername());
        user = userRepository.save(user);

        split.addUser(user);

        return SplitResponseBuilder.create(objectMapper)
                .showUsers()
                .build(splitRepository.save(split));
    }
}
