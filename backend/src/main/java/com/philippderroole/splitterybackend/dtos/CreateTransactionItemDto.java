package com.philippderroole.splitterybackend.dtos;

public class CreateTransactionItemDto implements CreateOrUpdateTransactionItemDto {
    private String name;

    private double amount;

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
