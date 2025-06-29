package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.philippderroole.splitterybackend.dtos.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.TransactionDto;
import com.philippderroole.splitterybackend.dtos.UpdateTransactionDto;
import com.philippderroole.splitterybackend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;

@RestController()
@RequestMapping("/api/splits/{splitUrl}")
public class TransactionController {

    private final SimpMessagingTemplate messagingTemplate;
    private final TransactionService transactionService;

    public TransactionController(SimpMessagingTemplate messagingTemplate, TransactionService transactionService) {
        this.messagingTemplate = messagingTemplate;
        this.transactionService = transactionService;
    }

    @GetMapping(path = "/transactions")
    public ResponseEntity<JsonNode> getTransactions(@PathVariable String splitUrl) {
        try {
            JsonNode transactionGroups = transactionService.getTransactions(splitUrl);

            return new ResponseEntity<>(transactionGroups, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @GetMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<JsonNode> getTransaction(@PathVariable String splitUrl, @PathVariable String transactionUrl) {
        try {
            JsonNode transactionGroup = transactionService.getTransaction(splitUrl, transactionUrl);

            return new ResponseEntity<>(transactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PostMapping(path = "/transactions")
    public ResponseEntity<TransactionDto> createTransaction(@PathVariable String splitUrl, @RequestBody CreateTransactionDto createTransactionDto) {
        try {
            TransactionDto createdTransactionGroup = transactionService.createTransaction(splitUrl, createTransactionDto);

            notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(createdTransactionGroup, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    @PutMapping(path = "/transactions/{transactionUrl}")
    public ResponseEntity<JsonNode> updateTransaction(@PathVariable String splitUrl, @PathVariable String transactionUrl, @RequestBody UpdateTransactionDto transactionDto) {
        try {
            JsonNode updatedTransaction = transactionService.updateTransaction(splitUrl, transactionUrl, transactionDto);

            notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(updatedTransaction, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(BAD_REQUEST);
        }
    }

    private void notifyTransactionUpdate(String splitUrl) {
        messagingTemplate.convertAndSend("/topic/splits/" + splitUrl + "/transactions", transactionService.getTransactions(splitUrl));
    }
}
