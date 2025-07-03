package com.philippderroole.splitterybackend.dtos.transaction_item;

public abstract class TransactionItemDto {
    private final double amount;
    private final String name;

    protected TransactionItemDto(double amount, String name) {
        this.amount = amount;
        this.name = name;
    }

    public double getAmount() {
        return amount;
    }

    public String getName() {
        return name;
    }
}
