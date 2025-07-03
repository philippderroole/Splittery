package com.philippderroole.splitterybackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.responsebuilders.SplitResponseBuilder;
import com.philippderroole.splitterybackend.responsebuilders.TransactionResponseBuilder;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public final class SocketHandler {
    private final SimpMessagingTemplate messagingTemplate;
    private final ValidationService validationService;
    private final ObjectMapper objectMapper;

    public SocketHandler(SimpMessagingTemplate messagingTemplate, ValidationService validationService, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.validationService = validationService;
        this.objectMapper = objectMapper;
    }

    public void notifySplitUpdate(String splitUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        JsonNode response = SplitResponseBuilder.create(objectMapper)
                .showUsers()
                .build(split);
        messagingTemplate.convertAndSend("/topic/splits/" + split.getUrl(), response);
    }

    public void notifyTransactionUpdate(String splitUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        JsonNode response = objectMapper.createArrayNode().addAll(
                split.getTransactions().stream()
                        .map(transaction -> TransactionResponseBuilder.create(objectMapper).build(transaction))
                        .collect(Collectors.toList()));
        messagingTemplate.convertAndSend("/topic/splits/" + split.getUrl() + "/transactions", response);
    }
}
