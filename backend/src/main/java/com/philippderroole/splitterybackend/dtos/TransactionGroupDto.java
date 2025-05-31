package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.TransactionGroup;

import java.util.Date;

public class TransactionGroupDto {

    private String id;

    private double amount;

    private String name;

    private String splitId;

    private String url;

    private Date date;

    public static TransactionGroupDto from(TransactionGroup transactionGroup) {
        TransactionGroupDto transactionGroupDto = new TransactionGroupDto();
        transactionGroupDto.setId(transactionGroup.getId());
        transactionGroupDto.setName(transactionGroup.getName());
        transactionGroupDto.setAmount(transactionGroup.getAmount());
        transactionGroupDto.setSplitId(transactionGroup.getSplit().getId());
        transactionGroupDto.setUrl(transactionGroup.getUrl());
        transactionGroupDto.setDate(transactionGroup.getDate());
        return transactionGroupDto;
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
}
