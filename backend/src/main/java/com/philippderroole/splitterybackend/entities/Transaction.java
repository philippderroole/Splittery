package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Collection;

@Entity
public class Transaction {

    @Id
    @UuidGenerator
    private String id;

    private String value;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String name) {
        this.value = name;
    }
}
