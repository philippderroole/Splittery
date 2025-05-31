package com.philippderroole.splitterybackend.dtos;

import java.util.Date;

public class CreateTransactionGroupDto {

    private double amount;

    private String name;

    private Date date;

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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
