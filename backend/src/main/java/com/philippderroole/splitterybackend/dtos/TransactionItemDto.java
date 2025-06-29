package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.TransactionItem;

public class TransactionItemDto {

    private String id;

    private double amount;

    private String name;

    public static TransactionItemDto from(TransactionItem transactionItem) {
        TransactionItemDto itemDto = new TransactionItemDto();
        itemDto.setId(transactionItem.getId());
        itemDto.setName(transactionItem.getName());
        itemDto.setAmount(transactionItem.getAmount());
        return itemDto;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
