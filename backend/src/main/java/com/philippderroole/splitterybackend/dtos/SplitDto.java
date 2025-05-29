package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.Split;

public class SplitDto {

    private String id;
    private String name;
    private String url;

    public static SplitDto from(Split split) {
        SplitDto splitDto = new SplitDto();
        splitDto.setId(split.getId());
        splitDto.setName(split.getName());
        splitDto.setUrl(split.getUrl());
        return splitDto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
