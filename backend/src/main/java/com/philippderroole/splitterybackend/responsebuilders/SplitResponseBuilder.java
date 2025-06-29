package com.philippderroole.splitterybackend.responsebuilders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.philippderroole.splitterybackend.entities.Split;

public final class SplitResponseBuilder {

    private final ObjectMapper objectMapper;

    private boolean showUsers;

    private SplitResponseBuilder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public static SplitResponseBuilder create(ObjectMapper objectMapper) {
        return new SplitResponseBuilder(objectMapper);
    }

    public SplitResponseBuilder showUsers() {
        this.showUsers = true;
        return this;
    }

    public ObjectNode build(Split split) {
        ObjectNode splitDto = objectMapper.createObjectNode();
        splitDto
                .put("id", split.getId())
                .put("name", split.getName())
                .put("url", split.getUrl());

        if (showUsers) {
            splitDto.set("users", buildUsers(split));
        }

        return splitDto;
    }

    private JsonNode buildUsers(Split split) {
        ArrayNode arrayNode = objectMapper.createArrayNode();
        split.getUsers().forEach(user -> {
            ObjectNode userNode = objectMapper.createObjectNode()
                    .put("id", user.getId())
                    .put("username", user.getUsername())
                    .put("balance", split.getBalance(user));
            arrayNode.add(userNode);
        });
        return arrayNode;
    }
}
