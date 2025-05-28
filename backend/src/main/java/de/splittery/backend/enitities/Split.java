package de.splittery.backend.enitities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.Collection;

@Entity
public class Split {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @OneToMany
    private Collection<Transaction> transactions;

    @OneToMany
    private Collection<SplitUser> splitUsers;

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

    public Collection<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(Collection<Transaction> transactions) {
        this.transactions = transactions;
    }

    public void addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
    }

    public Collection<SplitUser> getUsers() {
        return splitUsers;
    }

    public void setUsers(Collection<SplitUser> splitUsers) {
        this.splitUsers = splitUsers;
    }
}
