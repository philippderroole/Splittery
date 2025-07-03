package com.philippderroole.splitterybackend.dtos.transaction;

import java.util.Date;

public abstract class TransactionDto {
    private final double amount;
    private final String name;
    private final Date date;

    public TransactionDto(double amount, String name, Date date) {
        this.amount = amount;
        this.name = name;
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public String getName() {
        return name;
    }

    public Date getDate() {
        return date;
    }
}
