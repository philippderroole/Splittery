package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.TransactionItemRepository;
import com.philippderroole.splitterybackend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public final class ValidationService {
    private final SplitRepository splitRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;

    public ValidationService(SplitRepository splitRepository, TransactionRepository transactionRepository, TransactionItemRepository transactionItemRepository) {
        this.splitRepository = splitRepository;
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
    }

    public Split findSplitByUrl(String splitUrl) {
        return splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));
    }

    public Transaction findTransactionByUrl(String transactionUrl) {
        return transactionRepository.findByUrl(transactionUrl)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
    }

    public TransactionItem findTransactionItemByUrl(String itemUrl) {
        return transactionItemRepository.findByUrl(itemUrl)
                .orElseThrow(() -> new IllegalArgumentException("TransactionItem not found"));
    }

    public void validateTransactionBelongsToSplit(Transaction transaction, Split split) {
        if (!transaction.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("TransactionItem does not belong to the specified split");
        }
    }

    public void validateItemBelongsToTransaction(TransactionItem item, Transaction transaction) {

        if (!transaction.getItems().contains(item)) {
            throw new IllegalArgumentException("TransactionItem does not belong to the specified transaction");
        }
    }
}
