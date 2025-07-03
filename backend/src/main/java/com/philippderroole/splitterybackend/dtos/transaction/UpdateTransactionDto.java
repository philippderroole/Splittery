package com.philippderroole.splitterybackend.dtos.transaction;

import java.util.Date;

public class UpdateTransactionDto extends TransactionDto {
    public UpdateTransactionDto(double amount, String name, Date date) {
        super(amount, name, date);
    }
}
