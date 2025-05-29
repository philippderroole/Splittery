package com.philippderroole.splitterybackend.controller;

import com.philippderroole.splitterybackend.dtos.CreateTransactionGroupDto;
import com.philippderroole.splitterybackend.dtos.TransactionGroupDto;
import com.philippderroole.splitterybackend.service.TransactionGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController()
@RequestMapping("/api/splits/{splitId}/transactions")
public class TransactionGroupController {

    @Autowired
    private TransactionGroupService transactionGroupService;

    @GetMapping(path = "/{transactionId}")
    public ResponseEntity<TransactionGroupDto> getTransactionGroup(@PathVariable String splitId, @PathVariable String transactionId) {
        try {
            TransactionGroupDto transactionGroup = transactionGroupService.getTransactionGroup(splitId, transactionId);

            return new ResponseEntity<>(transactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
    
    @PostMapping(path = "/transactions/")
    public ResponseEntity<TransactionGroupDto> createTransactionGroup(@PathVariable String splitId, @RequestBody CreateTransactionGroupDto createTransactionGroupDto) {
        try {
            TransactionGroupDto createdTransactionGroup = transactionGroupService.createTransactionGroup(splitId, createTransactionGroupDto);

            return new ResponseEntity<>(createdTransactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}
