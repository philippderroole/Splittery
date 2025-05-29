package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateTransactionGroupDto;
import com.philippderroole.splitterybackend.dtos.TransactionGroupDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.TransactionGroup;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.TransactionGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionGroupService {

    @Autowired
    private TransactionGroupRepository transactionGroupRepository;

    @Autowired
    private SplitRepository splitRepository;

    public TransactionGroupDto getTransactionGroup(String splitId, String transactionId) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        TransactionGroup transactionGroup = transactionGroupRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction group not found"));

        if (!transactionGroup.getSplit().getId().equals(split.getId())) {
            throw new IllegalArgumentException("Transaction group does not belong to the specified split");
        }

        return TransactionGroupDto.from(transactionGroup);
    }

    public TransactionGroupDto createTransactionGroup(String splitId, CreateTransactionGroupDto createTransactionGroupDto) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        TransactionGroup transactionGroup = new TransactionGroup();
        transactionGroup.setSplit(split);

        transactionGroup = transactionGroupRepository.save(transactionGroup);

        return TransactionGroupDto.from(transactionGroup);
    }
}
