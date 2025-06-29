package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateTransactionItemDto;
import com.philippderroole.splitterybackend.dtos.UpdateTransactionItemDto;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.TransactionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class TransactionItemService {
    @Autowired
    private TransactionItemRepository transactionItemRepository;

    public void deleteTransactionItem(TransactionItem transactionItem) {
        transactionItemRepository.delete(transactionItem);
    }

    public TransactionItem createOrUpdateTransactionItem(Transaction transaction, UpdateTransactionItemDto itemDto) {
        if (itemDto.getId() == null) {
            return createTransactionItem(transaction, itemDto);
        } else {
            return updateTransactionItem(transaction, itemDto);
        }
    }

    public Collection<TransactionItem> createTransactionItems(Transaction transaction, Collection<CreateTransactionItemDto> itemDtos) {
        return itemDtos.stream()
                .map(itemDto -> createTransactionItem(transaction, itemDto))
                .toList();
    }

    public TransactionItem createTransactionItem(Transaction transaction, CreateTransactionItemDto itemDto) {
        TransactionItem item = new TransactionItem();

        item.setName(itemDto.getName());
        item.setAmount(itemDto.getAmount());
        item.setTransaction(transaction);

        return transactionItemRepository.save(item);
    }

    public TransactionItem createTransactionItem(Transaction transaction, UpdateTransactionItemDto itemDto) {
        TransactionItem item = new TransactionItem();

        item.setName(itemDto.getName());
        item.setAmount(itemDto.getAmount());
        item.setTransaction(transaction);

        return transactionItemRepository.save(item);
    }

    private TransactionItem updateTransactionItem(Transaction transaction, UpdateTransactionItemDto itemDto) {
        TransactionItem item = transactionItemRepository.findById(itemDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("TransactionItem not found"));

        item.setName(itemDto.getName());
        item.setAmount(itemDto.getAmount());
        item.setTransaction(transaction);

        return transactionItemRepository.save(item);
    }
}
