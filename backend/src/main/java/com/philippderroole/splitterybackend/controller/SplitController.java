package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.dtos.user.AddUserDto;
import com.philippderroole.splitterybackend.service.SplitService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/splits")
public class SplitController {
    private final SimpMessagingTemplate messagingTemplate;
    private final SplitService splitService;

    public SplitController(SimpMessagingTemplate messagingTemplate, SplitService splitService) {
        this.messagingTemplate = messagingTemplate;
        this.splitService = splitService;
    }

    @GetMapping(path = "/{splitUrl}")
    public ResponseEntity<ObjectNode> getSplit(@PathVariable String splitUrl) {
        try {
            ObjectNode split = splitService.getSplit(splitUrl);
            return new ResponseEntity<>(split, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping
    public ResponseEntity<ObjectNode> createSplit(@RequestBody CreateSplitDto createSplitDto) {
        try {
            ObjectNode split = splitService.createSplit(createSplitDto);
            return new ResponseEntity<>(split, CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PutMapping(path = "/{splitUrl}")
    public ResponseEntity<ObjectNode> updateSplit(@PathVariable String splitUrl, @RequestBody CreateSplitDto createSplitDto) {
        try {
            ObjectNode updatedSplit = splitService.updateSplit(splitUrl, createSplitDto);
            notifySplitUpdate(updatedSplit);
            return new ResponseEntity<>(updatedSplit, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    private void notifySplitUpdate(ObjectNode updatedSplit) {
        String splitUrl = updatedSplit.get("url").asText();

        messagingTemplate.convertAndSend("/topic/splits/" + splitUrl, updatedSplit);
    }

    @PostMapping(path = "/{splitUrl}/users")
    ResponseEntity<ObjectNode> addUser(@PathVariable String splitUrl, @RequestBody AddUserDto addUserDto) {
        try {
            ObjectNode updatedSplit = splitService.addUser(splitUrl, addUserDto);
            notifySplitUpdate(updatedSplit);
            return new ResponseEntity<>(updatedSplit, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}