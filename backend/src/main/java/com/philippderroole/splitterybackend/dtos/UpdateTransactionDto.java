package com.philippderroole.splitterybackend.dtos;

import java.util.Collection;
import java.util.Date;

public class UpdateTransactionDto {

    private String id;

    private double amount;

    private String name;

    private String splitId;

    private String url;

    private Date date;

    private Collection<CreateOrUpdateTransactionItemDto> items;

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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Collection<CreateOrUpdateTransactionItemDto> getItems() {
        return items;
    }

    public void setItems(Collection<CreateOrUpdateTransactionItemDto> items) {
        this.items = items;
    }
}
