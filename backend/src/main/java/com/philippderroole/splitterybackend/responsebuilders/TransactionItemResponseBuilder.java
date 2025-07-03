package com.philippderroole.splitterybackend.responsebuilders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.philippderroole.splitterybackend.entities.TransactionItem;

public final class TransactionItemResponseBuilder {
    private final ObjectMapper objectMapper;

    private TransactionItemResponseBuilder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public static TransactionItemResponseBuilder create(ObjectMapper objectMapper) {
        return new TransactionItemResponseBuilder(objectMapper);
    }

    public JsonNode build(TransactionItem item) {
        return objectMapper.createObjectNode()
                .put("id", item.getId())
                .put("name", item.getName())
                .put("amount", item.getAmount());

    }
}
