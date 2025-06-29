package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.Transaction;

import java.util.Collection;
import java.util.Date;

public class TransactionDto {

    private String id;

    private double amount;

    private String name;

    private String splitId;

    private String url;

    private Date date;

    private Collection<TransactionItemDto> items;

    public static TransactionDto from(Transaction transaction) {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setId(transaction.getId());
        transactionDto.setName(transaction.getName());
        transactionDto.setAmount(transaction.getAmount());
        transactionDto.setSplitId(transaction.getSplit().getId());
        transactionDto.setUrl(transaction.getUrl());
        transactionDto.setDate(transaction.getDate());

        transactionDto.setItems(transaction.getItems().stream()
                .map(TransactionItemDto::from)
                .toList());

        return transactionDto;
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

    public Collection<TransactionItemDto> getItems() {
        return items;
    }

    public void setItems(Collection<TransactionItemDto> items) {
        this.items = items;
    }
}
