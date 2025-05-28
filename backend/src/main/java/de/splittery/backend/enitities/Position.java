package de.splittery.backend.enitities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import org.javamoney.moneta.Money;

@Entity
public class Position {
    @Id
    private Long id;

    @ManyToOne
    private Transaction transaction;

    private Money money;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transaction getExpense() {
        return transaction;
    }

    public void setExpense(Transaction transaction) {
        this.transaction = transaction;
    }

    public Money getMoney() {
        return money;
    }

    public void setMoney(Money money) {
        this.money = money;
    }
}
