package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import org.hibernate.annotations.UuidGenerator;

import java.util.Collection;

@Entity
public class TransactionGroup {
    @Id
    @UuidGenerator
    private String id;

    @ManyToOne
    private Split split;

    @OneToMany
    private Collection<Transaction> transactions;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Collection<Transaction> getTransactions() {
        return transactions;
    }

    public Split getSplit() {
        return split;
    }

    public void setSplit(Split split) {
        this.split = split;
    }

    public void setTransactions(Collection<Transaction> transactions) {
        this.transactions = transactions;
    }
}
