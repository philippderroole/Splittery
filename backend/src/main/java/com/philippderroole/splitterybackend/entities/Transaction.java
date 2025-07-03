package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Entity
public class Transaction {
    public static final int URL_LENGTH = 8;

    @Id
    @UuidGenerator
    private String id;

    @ManyToOne
    @JoinColumn(name = "split_id", nullable = false)
    private Split split;

    private double amount;

    private String url;

    private String name;

    private Date date;

    @OneToMany(
            mappedBy = "transaction",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Collection<TransactionItem> items = new ArrayList<>();

    public void addItem(TransactionItem item) {
        this.items.add(item);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Collection<TransactionItem> getItems() {
        return items;
    }

    public void setItems(Collection<TransactionItem> transactions) {
        this.items = transactions;
    }

    public Split getSplit() {
        return split;
    }

    public void setSplit(Split split) {
        this.split = split;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
