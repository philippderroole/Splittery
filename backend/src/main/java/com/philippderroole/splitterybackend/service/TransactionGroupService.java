package com.philippderroole.splitterybackend.service;

import com.philippderroole.splitterybackend.dtos.CreateTransactionGroupDto;
import com.philippderroole.splitterybackend.dtos.TransactionGroupDto;
import com.philippderroole.splitterybackend.entities.Split;
import com.philippderroole.splitterybackend.entities.TransactionGroup;
import com.philippderroole.splitterybackend.repositories.SplitRepository;
import com.philippderroole.splitterybackend.repositories.TransactionGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

import static com.philippderroole.splitterybackend.entities.TransactionGroup.URL_LENGTH;

@Service
public class TransactionGroupService {

    @Autowired
    private TransactionGroupRepository transactionGroupRepository;

    @Autowired
    private SplitRepository splitRepository;

    public Collection<TransactionGroupDto> getTransactionGroups(String splitId) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        return split.getTransactionGroups().stream()
                .map(TransactionGroupDto::from)
                .toList();
    }

    public TransactionGroupDto getTransactionGroup(String splitId, String transactionUrl) {
        Split split = splitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Split not found"));

        TransactionGroup transactionGroup = transactionGroupRepository.findByUrl(transactionUrl)
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
        transactionGroup.setUrl(UrlUtils.generateUrl(URL_LENGTH));
        transactionGroup.setName(createTransactionGroupDto.getName());
        transactionGroup.setAmount(createTransactionGroupDto.getAmount());
        transactionGroup.setSplit(split);
        transactionGroup.setDate(createTransactionGroupDto.getDate());

        transactionGroup = transactionGroupRepository.save(transactionGroup);

        split.addTransactionGroup(transactionGroup);
        splitRepository.save(split);

        return TransactionGroupDto.from(transactionGroup);
    }
}
