package com.philippderroole.splitterybackend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.dtos.transaction_item.CreateTransactionItemDto;
import com.philippderroole.splitterybackend.dtos.transaction_item.UpdateTransactionItemDto;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.responsebuilders.TransactionItemResponseBuilder;
import com.philippderroole.splitterybackend.service.SocketHandler;
import com.philippderroole.splitterybackend.service.TransactionItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/splits/{splitUrl}/transactions/{transactionUrl}/items")
public class TransactionItemController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionItemController.class);
    private final TransactionItemService transactionItemService;
    private final SocketHandler socketHandler;
    private final ObjectMapper objectMapper;

    public TransactionItemController(TransactionItemService transactionItemService, SocketHandler socketHandler, ObjectMapper objectMapper) {
        this.transactionItemService = transactionItemService;
        this.socketHandler = socketHandler;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<JsonNode> createTransactionItem(@PathVariable String splitUrl, @PathVariable String transactionUrl, @RequestBody CreateTransactionItemDto itemData) {
        try {
            TransactionItem transactionItem = transactionItemService.createTransactionItem(splitUrl, transactionUrl, itemData);
            JsonNode response = TransactionItemResponseBuilder.create(objectMapper).build(transactionItem);
            socketHandler.notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.error("Error creating transaction item: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/{itemUrl}")
    public ResponseEntity<JsonNode> getTransactionItem(@PathVariable String splitUrl, @PathVariable String transactionUrl, @PathVariable String itemUrl) {
        try {
            TransactionItem transactionItem = transactionItemService.getTransactionItem(splitUrl, transactionUrl, itemUrl);
            JsonNode response = TransactionItemResponseBuilder.create(objectMapper).build(transactionItem);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("Error creating transaction item: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/{itemUrl}")
    public ResponseEntity<JsonNode> updateTransactionItem(@PathVariable String splitUrl, @PathVariable String transactionUrl, @PathVariable String itemUrl, @RequestBody UpdateTransactionItemDto itemData) {
        try {
            TransactionItem transactionItem = transactionItemService.updateTransactionItem(splitUrl, transactionUrl, itemUrl, itemData);
            JsonNode response = TransactionItemResponseBuilder.create(objectMapper).build(transactionItem);
            socketHandler.notifyTransactionUpdate(splitUrl);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error("Error updating transaction item: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
