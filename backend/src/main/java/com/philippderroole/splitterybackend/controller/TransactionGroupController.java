package com.philippderroole.splitterybackend.controller;

import com.philippderroole.splitterybackend.dtos.CreateTransactionGroupDto;
import com.philippderroole.splitterybackend.dtos.TransactionGroupDto;
import com.philippderroole.splitterybackend.service.TransactionGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController()
@RequestMapping("/api/splits/{splitId}")
public class TransactionGroupController {

    @Autowired
    private TransactionGroupService transactionGroupService;

    @GetMapping(path = "/transactions")
    public ResponseEntity<Collection<TransactionGroupDto>> getTransactionGroups(@PathVariable String splitId) {
        try {
            Collection<TransactionGroupDto> transactionGroups = transactionGroupService.getTransactionGroups(splitId);

            return new ResponseEntity<>(transactionGroups, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @GetMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<TransactionGroupDto> getTransactionGroup(@PathVariable String splitId, @PathVariable String transactionUrl) {
        try {
            TransactionGroupDto transactionGroup = transactionGroupService.getTransactionGroup(splitId, transactionUrl);

            return new ResponseEntity<>(transactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping(path = "/transactions")
    public ResponseEntity<TransactionGroupDto> createTransactionGroup(@PathVariable String splitId, @RequestBody CreateTransactionGroupDto createTransactionGroupDto) {
        try {
            TransactionGroupDto createdTransactionGroup = transactionGroupService.createTransactionGroup(splitId, createTransactionGroupDto);

            return new ResponseEntity<>(createdTransactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}
