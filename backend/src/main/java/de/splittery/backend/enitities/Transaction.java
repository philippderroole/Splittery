package de.splittery.backend.enitities;

import jakarta.persistence.*;
import org.javamoney.moneta.Money;

import java.util.Collection;

@Entity
public class Transaction {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private Money money;

    @ManyToOne
    private Split split;

    @OneToMany
    private Collection<Position> positions;

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

    public Money getMoney() {
        return money;
    }

    public void setMoney(Money money) {
        this.money = money;
    }

    public Split getSplit() {
        return split;
    }

    public void setSplit(Split split) {
        this.split = split;
    }

    public Collection<Position> getPositions() {
        return positions;
    }

    public void setPositions(Collection<Position> positions) {
        this.positions = positions;
    }
}
