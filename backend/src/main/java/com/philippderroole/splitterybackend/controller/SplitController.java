package com.philippderroole.splitterybackend.controller;

import com.philippderroole.splitterybackend.dtos.CreateSplitDto;
import com.philippderroole.splitterybackend.dtos.SplitDto;
import com.philippderroole.splitterybackend.service.SplitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/splits")
public class SplitController {

    @Autowired
    private SplitService splitService;

    @GetMapping(path = "/{splitUrl}")
    public ResponseEntity<SplitDto> getSplit(@PathVariable String splitUrl) {
        try {
            SplitDto split = splitService.getSplit(splitUrl);
            return new ResponseEntity<>(split, OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping
    public ResponseEntity<SplitDto> createSplit(@RequestBody CreateSplitDto createSplitDto) {
        try {
            SplitDto split = splitService.createSplit(createSplitDto);
            return new ResponseEntity<>(split, CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}