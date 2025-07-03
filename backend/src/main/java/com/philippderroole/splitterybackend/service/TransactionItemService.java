package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.transaction_item.CreateTransactionItemDto;
import com.philippderroole.splitterybackend.dtos.transaction_item.UpdateTransactionItemDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.TransactionItemRepository;
import org.springframework.stereotype.Service;

@Service
public final class TransactionItemService {
    private final TransactionItemRepository transactionItemRepository;
    private final RemainingAmountItemService remainingAmountItemService;
    private final ValidationService validationService;

    public TransactionItemService(TransactionItemRepository transactionItemRepository, RemainingAmountItemService remainingAmountItemService, ValidationService validationService) {
        this.transactionItemRepository = transactionItemRepository;
        this.remainingAmountItemService = remainingAmountItemService;
        this.validationService = validationService;
    }


    public TransactionItem createTransactionItem(String splitUrl, String transactionUrl, CreateTransactionItemDto itemDto) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);

        if (itemDto.getAmount() > transaction.getAmount()) {
            throw new IllegalArgumentException("Item amount cannot exceed transaction amount");
        }

        TransactionItem item = new TransactionItem();
        item.setName(itemDto.getName());
        item.setAmount(itemDto.getAmount());
        item.setTransaction(transaction);
        item = transactionItemRepository.save(item);

        remainingAmountItemService.updateRemainingAmountItem(transaction);

        return item;
    }

    public TransactionItem getTransactionItem(String splitUrl, String transactionUrl, String itemUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);
        TransactionItem item = validationService.findTransactionItemByUrl(itemUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);
        validationService.validateItemBelongsToTransaction(item, transaction);

        return item;
    }

    public TransactionItem updateTransactionItem(String splitUrl, String transactionUrl, String itemUrl, UpdateTransactionItemDto itemData) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);
        TransactionItem item = validationService.findTransactionItemByUrl(itemUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);
        validationService.validateItemBelongsToTransaction(item, transaction);

        item.setName(itemData.getName());
        item.setAmount(itemData.getAmount());

        return transactionItemRepository.save(item);
    }

    public void deleteTransactionItem(String splitUrl, String transactionUrl, String itemUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);
        TransactionItem item = validationService.findTransactionItemByUrl(itemUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);
        validationService.validateItemBelongsToTransaction(item, transaction);

        transactionItemRepository.delete(item);
    }
}
