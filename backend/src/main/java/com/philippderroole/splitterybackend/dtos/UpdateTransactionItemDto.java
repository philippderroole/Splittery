package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.TransactionItem;

public class UpdateTransactionItemDto implements CreateOrUpdateTransactionItemDto {

    private String id;

    private double amount;

    private String name;

    public static UpdateTransactionItemDto from(TransactionItem transactionItem) {
        UpdateTransactionItemDto itemDto = new UpdateTransactionItemDto();
        itemDto.setId(transactionItem.getId());
        itemDto.setName(transactionItem.getName());
        itemDto.setAmount(transactionItem.getAmount());
        return itemDto;
    }

    public TransactionItem toEntity() {
        TransactionItem item = new TransactionItem();
        item.setName(this.getName());
        item.setAmount(this.getAmount());
        return item;
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
