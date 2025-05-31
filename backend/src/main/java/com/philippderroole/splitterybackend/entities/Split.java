package com.philippderroole.splitterybackend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import org.hibernate.annotations.UuidGenerator;

import java.util.Collection;

@Entity
public class Split {
    public static final int URL_LENGTH = 8;

    @Id
    @UuidGenerator
    private String id;

    private String name;

    private String url;

    @ManyToOne
    private User owner;

    @OneToMany
    private Collection<TransactionGroup> transactionGroups;

    public void addTransactionGroup(TransactionGroup transactionGroup) {
        transactionGroups.add(transactionGroup);
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

    public Collection<TransactionGroup> getTransactionGroups() {
        return transactionGroups;
    }

    public void setTransactionGroups(Collection<TransactionGroup> transactionGroups) {
        this.transactionGroups = transactionGroups;
    }
}
