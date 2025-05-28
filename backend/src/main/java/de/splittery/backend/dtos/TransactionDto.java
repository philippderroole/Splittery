package de.splittery.backend.dtos;

import org.javamoney.moneta.Money;

import java.util.Collection;

public class TransactionDto {
    private Long id;

    private String name;

    private Money money;

    private Long split;

    private Collection<Long> positions;

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

    public Long getSplit() {
        return split;
    }

    public void setSplit(Long split) {
        this.split = split;
    }

    public Collection<Long> getPositions() {
        return positions;
    }

    public void setPositions(Collection<Long> positions) {
        this.positions = positions;
    }
}
