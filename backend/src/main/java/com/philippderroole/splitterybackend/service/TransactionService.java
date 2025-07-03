package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.transaction.CreateTransactionDto;
import com.philippderroole.splitterybackend.dtos.transaction.UpdateTransactionDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.Transaction;
import com.philippderroole.splitterybackend.entities.TransactionItem;
import com.philippderroole.splitterybackend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Date;

import static com.philippderroole.splitterybackend.entities.Transaction.URL_LENGTH;

@Service
public final class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ValidationService validationService;
    private final RemainingAmountItemService remainingAmountItemService;

    public TransactionService(TransactionRepository transactionRepository, ValidationService validationService, RemainingAmountItemService remainingAmountItemService) {
        this.transactionRepository = transactionRepository;
        this.validationService = validationService;
        this.remainingAmountItemService = remainingAmountItemService;
    }

    public Collection<Transaction> getTransactions(String splitUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        return split.getTransactions();
    }

    public Transaction getTransaction(String splitUrl, String transactionUrl) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);

        return transaction;
    }

    public Transaction createTransaction(String splitUrl, CreateTransactionDto transactionDto) {
        Split split = validationService.findSplitByUrl(splitUrl);

        Transaction transaction = new Transaction();
        transaction.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        transaction.setName(transactionDto.getName());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setSplit(split);
        transaction.setDate(Date.from(Instant.now()));
        transaction = transactionRepository.save(transaction);

        TransactionItem remainingAmountItem = remainingAmountItemService.createRemainingAmountItem(transaction, transactionDto.getAmount());
        transaction.addItem(remainingAmountItem);

        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(String splitUrl, String transactionUrl, UpdateTransactionDto transactionDto) {
        Split split = validationService.findSplitByUrl(splitUrl);
        Transaction transaction = validationService.findTransactionByUrl(transactionUrl);

        validationService.validateTransactionBelongsToSplit(transaction, split);

        transaction.setName(transactionDto.getName());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setDate(transactionDto.getDate());

        return transactionRepository.save(transaction);
    }


}
