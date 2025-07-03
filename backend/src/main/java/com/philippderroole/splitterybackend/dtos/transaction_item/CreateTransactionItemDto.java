package com.philippderroole.splitterybackend.dtos.transaction_item;

public class CreateTransactionItemDto extends TransactionItemDto {
    public CreateTransactionItemDto(double amount, String name) {
        super(amount, name);
    }
}
