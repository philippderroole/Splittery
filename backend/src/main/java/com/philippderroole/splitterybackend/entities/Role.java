package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import org.hibernate.annotations.UuidGenerator;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Role {
    @Id
    @UuidGenerator
    private String id;

    private String name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> user = new HashSet<>();

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<User> getUser() {
        return user;
    }

    public void setUser(Set<User> user) {
        this.user = user;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }
}
