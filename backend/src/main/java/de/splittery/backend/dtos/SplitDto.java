package de.splittery.backend.dtos;

import java.util.Collection;

public class SplitDto {

    private Long id;

    private String name;

    private Collection<Long> users;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Collection<Long> getUsers() {
        return users;
    }

    public void setUsers(Collection<Long> users) {
        this.users = users;
    }
}
