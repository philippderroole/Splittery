package com.philippderroole.splitterybackend.dtos;

import java.util.Collection;
import java.util.Date;

public class UpdateTransactionDto {

    private String id;

    private double amount;

    private String name;

    private String splitId;

    private Date date;

    private Collection<UpdateTransactionItemDto> items;

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

    public String getSplitId() {
        return splitId;
    }

    public void setSplitId(String splitId) {
        this.splitId = splitId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Collection<UpdateTransactionItemDto> getItems() {
        return items;
    }

    public UpdateTransactionDto setItems(Collection<UpdateTransactionItemDto> items) {
        this.items = items;
        return this;
    }
}
