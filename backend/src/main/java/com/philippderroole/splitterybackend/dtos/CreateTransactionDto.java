package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.dtos.CreateTransactionItemDto;

import java.util.ArrayList;
import java.util.Collection;

public class CreateTransactionDto {

    private String name;

    private double amount;

    private Collection<CreateTransactionItemDto> items = new ArrayList<>();

    public void addItem(CreateTransactionItemDto item) {
        this.items.add(item);
    }

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

    public Collection<CreateTransactionItemDto> getItems() {
        return items;
    }

    public void setItems(Collection<CreateTransactionItemDto> items) {
        this.items = items;
    }
}
