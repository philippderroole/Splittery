package com.philippderroole.splitterybackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.philippderroole.splitterybackend.dtos.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.TransactionDto;
import com.philippderroole.splitterybackend.dtos.UpdateTransactionDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.TransactionRepository;
import com.philippderroole.splitterybackend.responsebuilders.TransactionResponseBuilder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;

import static com.philippderroole.splitterybackend.entities.Transaction.URL_LENGTH;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    private final SplitRepository splitRepository;

    private final TransactionItemService transactionItemService;

    private final ObjectMapper objectMapper;

    public TransactionService(TransactionRepository transactionRepository, SplitRepository splitRepository, TransactionItemService transactionItemService, ObjectMapper objectMapper) {
        this.transactionRepository = transactionRepository;
        this.splitRepository = splitRepository;
        this.transactionItemService = transactionItemService;
        this.objectMapper = objectMapper;
    }

    public JsonNode getTransactions(String splitUrl) {
        Split split = splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        ArrayNode transactions = objectMapper.createArrayNode();
        split.getTransactions().forEach(transaction -> transactions.add(
                TransactionResponseBuilder.create(objectMapper)
                        .build(transaction)));

        return transactions;
    }

    public JsonNode getTransaction(String splitUrl, String transactionUrl) {
        Split split = splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        Transaction transaction = transactionRepository.findByUrl(transactionUrl)
                .orElseThrow(() -> new IllegalArgumentException("TransactionItem group not found"));

        if (!transaction.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("TransactionItem group does not belong to the specified split");
        }

        return TransactionResponseBuilder.create(objectMapper)
                .build(transaction);
    }

    public TransactionDto createTransaction(String splitUrl, CreateTransactionDto createTransactionDto) {
        Split split = splitRepository.findByUrl(splitUrl)
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

    public JsonNode updateTransaction(String splitUrl, String transactionUrl, UpdateTransactionDto transactionDto) {
        Split split = splitRepository.findByUrl(splitUrl)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        Transaction transaction = transactionRepository.findByUrl(transactionUrl)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (!transaction.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("Transaction does not belong to the specified split");
        }

        transaction.setName(transactionDto.getName());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDate(transactionDto.getDate());

        transaction = transactionRepository.save(transaction);

        Collection<TransactionItem> updatedItems = transactionItemService.updateTransactionItems(transaction, transactionDto.getItems());
        transaction.setItems(updatedItems);

        return TransactionResponseBuilder.create(objectMapper)
                .build(transaction);
    }
}
