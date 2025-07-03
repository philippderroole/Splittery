package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.user.AddUserDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.User;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public final class UserService {
    private final UserRepository userRepository;
    private final ValidationService validationService;
    private final SplitRepository splitRepository;

    public UserService(UserRepository userRepository, ValidationService validationService, SplitRepository splitRepository) {
        this.userRepository = userRepository;
        this.validationService = validationService;
        this.splitRepository = splitRepository;
    }

    public User createUser(String splitUrl, AddUserDto userDto) {
        Split split = validationService.findSplitByUrl(splitUrl);

        User user = new User();
        user.setUsername(userDto.getUsername());
        user = userRepository.save(user);

        split.addUser(user);
        splitRepository.save(split);

        return userRepository.save(user);
    }
}
