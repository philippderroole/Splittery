package com.philippderroole.splitterybackend.dtos.user;

import com.philippderroole.splitterybackend.entities.User;

public class UserDto {
    private String id;
    private String name;

    public static UserDto fromUser(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.name = user.getName();
        return userDto;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
