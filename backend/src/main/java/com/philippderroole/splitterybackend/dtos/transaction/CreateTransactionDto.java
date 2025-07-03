package com.philippderroole.splitterybackend.dtos.transaction;

import java.util.Date;

public class CreateTransactionDto extends TransactionDto {
    public CreateTransactionDto(double amount, String name, Date date) {
        super(amount, name, date);
    }
}
