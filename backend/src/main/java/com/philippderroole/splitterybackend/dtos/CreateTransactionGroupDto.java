package com.philippderroole.splitterybackend.dtos;

import com.philippderroole.splitterybackend.entities.TransactionGroup;

public class CreateTransactionGroupDto {

    public static CreateTransactionGroupDto from(TransactionGroup transactionGroup) {
        CreateTransactionGroupDto transactionGroupDto = new CreateTransactionGroupDto();
        return transactionGroupDto;
    }
}
