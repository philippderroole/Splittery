package com.philippderroole.splitterybackend.controller;

import com.philippderroole.splitterybackend.dtos.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.TransactionDto;
import com.philippderroole.splitterybackend.dtos.UpdateTransactionDto;
import com.philippderroole.splitterybackend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController()
@RequestMapping("/api/splits/{splitId}")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping(path = "/transactions")
    public ResponseEntity<Collection<TransactionDto>> getTransactions(@PathVariable String splitId) {
        try {
            Collection<TransactionDto> transactionGroups = transactionService.getTransactions(splitId);

            return new ResponseEntity<>(transactionGroups, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @GetMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<TransactionDto> getTransaction(@PathVariable String splitId, @PathVariable String transactionUrl) {
        try {
            TransactionDto transactionGroup = transactionService.getTransaction(splitId, transactionUrl);

            return new ResponseEntity<>(transactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping(path = "/transactions")
    public ResponseEntity<TransactionDto> createTransaction(@PathVariable String splitId, @RequestBody CreateTransactionDto createTransactionDto) {
        try {
            TransactionDto createdTransactionGroup = transactionService.createTransaction(splitId, createTransactionDto);

            return new ResponseEntity<>(createdTransactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PutMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<TransactionDto> updateTransaction(@PathVariable String splitId, @PathVariable String transactionUrl, @RequestBody UpdateTransactionDto transactionDto) {
        try {
            TransactionDto updatedTransactionGroup = transactionService.updateTransaction(splitId, transactionUrl, transactionDto);

            return new ResponseEntity<>(updatedTransactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }
}
