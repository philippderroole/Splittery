package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.dtos.transaction.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.transaction.UpdateTransactionDto;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.responsebuilders.TransactionResponseBuilder;
import com.philippderroole.splitterybackend.service.SocketHandler;
import com.philippderroole.splitterybackend.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/splits/{splitUrl}")
public class TransactionController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionController.class);
    private final TransactionService transactionService;
    private final SocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    public TransactionController(TransactionService transactionService, SocketHandler socketHandler, ObjectMapper objectMapper) {
        this.socketHandler = socketHandler;
        this.transactionService = transactionService;
        this.objectMapper = objectMapper;
    }

    @GetMapping(path = "/transactions")
    public ResponseEntity<JsonNode> getTransactions(@PathVariable String splitUrl) {
        try {
            Collection<Transaction> transactions = transactionService.getTransactions(splitUrl);
            JsonNode response = objectMapper.createArrayNode().addAll(
                    transactions.stream()
                            .map(transaction -> TransactionResponseBuilder.create(objectMapper).build(transaction))
                            .collect(Collectors.toList()));
            return new ResponseEntity<>(response, OK);
        } catch (Exception e) {
            LOGGER.error("Error retrieving transactions: {}", e.getMessage(), e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<JsonNode> getTransaction(@PathVariable String splitUrl, @PathVariable String transactionUrl) {
        try {
            Transaction transaction = transactionService.getTransaction(splitUrl, transactionUrl);
            JsonNode response = TransactionResponseBuilder.create(objectMapper).build(transaction);
            return new ResponseEntity<>(response, OK);
        } catch (Exception e) {
            LOGGER.error("Error retrieving transaction: {}", e.getMessage(), e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(path = "/transactions")
    public ResponseEntity<JsonNode> createTransaction(@PathVariable String splitUrl, @RequestBody CreateTransactionDto createTransactionDto) {
        try {
            Transaction transaction = transactionService.createTransaction(splitUrl, createTransactionDto);
            JsonNode response = TransactionResponseBuilder.create(objectMapper).build(transaction);
            socketHandler.notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(response, OK);
        } catch (Exception e) {
            LOGGER.error("Error creating transaction: {}", e.getMessage(), e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<JsonNode> updateTransaction(@PathVariable String splitUrl, @PathVariable String transactionUrl, @RequestBody UpdateTransactionDto transactionDto) {
        try {
            Transaction transaction = transactionService.updateTransaction(splitUrl, transactionUrl, transactionDto);
            JsonNode response = TransactionResponseBuilder.create(objectMapper).build(transaction);
            socketHandler.notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(response, OK);
        } catch (Exception e) {
            LOGGER.error("Error updating transaction: {}", e.getMessage(), e);
            return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
        }
    }
}
