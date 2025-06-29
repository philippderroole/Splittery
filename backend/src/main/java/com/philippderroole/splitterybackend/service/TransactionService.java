package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateOrUpdateTransactionItemDto;
import com.philippderroole.splitterybackend.dtos.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.TransactionDto;
import com.philippderroole.splitterybackend.dtos.UpdateTransactionDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;

import static com.philippderroole.splitterybackend.entities.Transaction.URL_LENGTH;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private SplitRepository splitRepository;

    @Autowired
    private TransactionItemService transactionItemService;

    public Collection<TransactionDto> getTransactions(String splitId) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        return split.getTransactions().stream()
                .map(TransactionDto::from)
                .toList();
    }

    public TransactionDto getTransaction(String splitId, String transactionUrl) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        Transaction transaction = transactionRepository.findByUrl(transactionUrl)
                .orElseThrow(() -> new IllegalArgumentException("TransactionItem group not found"));

        if (!transaction.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("TransactionItem group does not belong to the specified split");
        }

        return TransactionDto.from(transaction);
    }

    public TransactionDto createTransaction(String splitId, CreateTransactionDto createTransactionDto) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        Transaction transaction = new Transaction();

        transaction.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        transaction.setName(createTransactionDto.getName());
        transaction.setAmount(createTransactionDto.getAmount());
        transaction.setSplit(split);
        transaction.setDate(Date.from(Instant.now()));

        transaction = transactionRepository.save(transaction);

        Collection<TransactionItem> transactionItems = transactionItemService.createTransactionItems(transaction, createTransactionDto.getItems());
        transaction.setItems(transactionItems);

        return TransactionDto.from(transaction);
    }

    public TransactionDto updateTransaction(String splitId, String transactionUrl, UpdateTransactionDto transactionDto) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        Transaction transaction = transactionRepository.findByUrl(transactionUrl)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (!transaction.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("Transaction does not belong to the specified split");
        }

        transaction.setName(transactionDto.getName());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDate(transactionDto.getDate());
        transaction.setUrl(transactionDto.getUrl());

        transaction = transactionRepository.save(transaction);

        Collection<TransactionItem> updatedItems = updateTransactionItems(transaction, transactionDto.getItems());
        transaction.setItems(updatedItems);

        return TransactionDto.from(transaction);
    }

    private Collection<TransactionItem> updateTransactionItems(Transaction transaction, Collection<CreateOrUpdateTransactionItemDto> itemDtos) {
        return itemDtos.stream()
                .map(itemDto -> transactionItemService.createOrUpdateTransactionItem(transaction, itemDto))
                .toList();
    }
}
