package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.TransactionItemRepository;
import org.springframework.stereotype.Service;

@Service
public final class RemainingAmountItemService {
    private static final String REMAINING_ITEM_NAME = "Remaining";
    private final TransactionItemRepository transactionItemRepository;
    private final SocketHandler socketHandler;

    public RemainingAmountItemService(TransactionItemRepository transactionItemRepository, SocketHandler socketHandler) {
        this.transactionItemRepository = transactionItemRepository;
        this.socketHandler = socketHandler;
    }

    public TransactionItem createRemainingAmountItem(Transaction transaction, double amount) {
        TransactionItem item = new TransactionItem();
        item.setName(REMAINING_ITEM_NAME);
        item.setAmount(amount);
        item.setTransaction(transaction);

        socketHandler.notifyTransactionUpdate(transaction.getSplit().getUrl());

        return transactionItemRepository.save(item);
    }

    public TransactionItem getRemainingAmountItem(Transaction transaction) {
        return transaction.getItems().stream()
                .filter(item -> REMAINING_ITEM_NAME.equals(item.getName()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Remaining item not found"));
    }

    public void updateRemainingAmountItem(Transaction transaction) {
        double itemTotal = transaction.getItems().stream()
                .filter(item -> !REMAINING_ITEM_NAME.equals(item.getName()))
                .mapToDouble(TransactionItem::getAmount)
                .sum();
        TransactionItem remainingItem = getRemainingAmountItem(transaction);
        remainingItem.setAmount(transaction.getAmount() - itemTotal);
        transactionItemRepository.save(remainingItem);

        socketHandler.notifyTransactionUpdate(transaction.getSplit().getUrl());
    }
}
