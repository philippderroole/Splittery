package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Entity
public class Split {
    public static final int URL_LENGTH = 8;

    @Id
    @UuidGenerator
    private String id;

    private String name;

    private String url;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "split")
    private Collection<Transaction> transactions = new ArrayList<>();

    @ManyToMany
    private Collection<User> users = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "split_balances", joinColumns = @JoinColumn(name = "split_id"))
    @MapKeyJoinColumn(name = "user_id")
    private Map<User, Double> balances = new HashMap<>();

    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }

    public void addUser(User user) {
        users.add(user);
    }

    public Double getBalance(User user) {
        return balances.getOrDefault(user, 0.0);
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User ownerId) {
        this.owner = ownerId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Collection<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Collection<Transaction> transactions) {
        this.transactions = transactions;
    }

    public Collection<User> getUsers() {
        return users;
    }
}
