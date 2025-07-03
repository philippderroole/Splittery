package com.philippderroole.splitterybackend.responsebuilders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.philippderroole.splitterybackend.entities.Transaction;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class TransactionResponseBuilder {
    private final ObjectMapper objectMapper;

    private TransactionResponseBuilder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public static TransactionResponseBuilder create(ObjectMapper objectMapper) {
        return new TransactionResponseBuilder(objectMapper);
    }


    public ObjectNode build(Transaction transaction) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        LocalDateTime localDateTime = transaction.getDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        return objectMapper.createObjectNode()
                .put("id", transaction.getId())
                .put("name", transaction.getName())
                .put("amount", transaction.getAmount())
                .put("splitId", transaction.getSplit().getId())
                .put("url", transaction.getUrl())
                .put("date", formatter.format(localDateTime))
                .set("items", buildItems(transaction));
    }

    private JsonNode buildItems(Transaction transaction) {
        ArrayNode items = objectMapper.createArrayNode();

        transaction.getItems().forEach(
                item -> items.add(
                        TransactionItemResponseBuilder.create(objectMapper)
                                .build(item))
        );

        return items;
    }
}
