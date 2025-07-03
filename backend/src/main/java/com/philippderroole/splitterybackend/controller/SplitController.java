package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.responsebuilders.SplitResponseBuilder;
import com.philippderroole.splitterybackend.service.SocketHandler;
import com.philippderroole.splitterybackend.service.SplitService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/splits")
public class SplitController {
    private static final Logger LOGGER = LoggerFactory.getLogger(SplitController.class);
    private final SplitService splitService;
    private final SocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    public SplitController(SplitService splitService, SocketHandler socketHandler, ObjectMapper objectMapper) {
        this.splitService = splitService;
        this.socketHandler = socketHandler;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<JsonNode> createSplit(@RequestBody CreateSplitDto createSplitDto) {
        try {
            Split split = splitService.createSplit(createSplitDto);
            JsonNode response = SplitResponseBuilder.create(objectMapper)
                    .showUsers()
                    .build(split);
            return new ResponseEntity<>(response, CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @GetMapping(path = "/{splitUrl}")
    public ResponseEntity<JsonNode> getSplit(@PathVariable String splitUrl) {
        try {
            Split split = splitService.getSplit(splitUrl);
            JsonNode response = SplitResponseBuilder.create(objectMapper)
                    .showUsers()
                    .build(split);
            return new ResponseEntity<>(response, OK);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Error retrieving split: {}", e.getMessage(), e);
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PutMapping(path = "/{splitUrl}")
    public ResponseEntity<JsonNode> updateSplit(@PathVariable String splitUrl, @RequestBody CreateSplitDto createSplitDto) {
        try {
            Split split = splitService.updateSplit(splitUrl, createSplitDto);
            JsonNode response = SplitResponseBuilder.create(objectMapper)
                    .showUsers()
                    .build(split);
            socketHandler.notifySplitUpdate(splitUrl);
            return new ResponseEntity<>(response, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}