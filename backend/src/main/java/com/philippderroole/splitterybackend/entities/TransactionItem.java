package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import org.hibernate.annotations.UuidGenerator;

@Entity
public class TransactionItem {

    @Id
    @UuidGenerator
    private String id;

    private String name;

    private double amount;

    private String url;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Transaction transaction;

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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public TransactionItem setTransaction(Transaction transaction) {
        this.transaction = transaction;
        return this;
    }
}
