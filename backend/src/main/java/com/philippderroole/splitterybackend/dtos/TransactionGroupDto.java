package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.TransactionGroup;

public class TransactionGroupDto {

    public static TransactionGroupDto from(TransactionGroup transactionGroup) {
        TransactionGroupDto transactionGroupDto = new TransactionGroupDto();
        return transactionGroupDto;
    }
}
