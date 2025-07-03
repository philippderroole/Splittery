package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.dtos.user.AddUserDto;
import com.philippderroole.splitterybackend.entities.User;
import com.philippderroole.splitterybackend.service.SocketHandler;
import com.philippderroole.splitterybackend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/splits/{splitUrl}/users")
public class UserController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final SocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    public UserController(UserService userService, SocketHandler socketHandler, ObjectMapper objectMapper) {
        this.userService = userService;
        this.socketHandler = socketHandler;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    ResponseEntity<User> addUser(@PathVariable String splitUrl, @RequestBody AddUserDto addUserDto) {
        try {
            User user = userService.createUser(splitUrl, addUserDto);
            socketHandler.notifySplitUpdate(splitUrl);
            return new ResponseEntity<>(user, OK);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Error adding user: {}", e.getMessage(), e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }
}
