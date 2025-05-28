package de.splittery.backend.mappers;

import de.splittery.backend.dtos.TransactionDto;
import de.splittery.backend.enitities.Position;
import de.splittery.backend.enitities.Transaction;
import de.splittery.backend.repositories.PositionRepository;
import de.splittery.backend.repositories.SplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class TransactionMapper implements Mapper<TransactionDto, Transaction> {

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private SplitRepository splitRepository;

    public Transaction toEntity(TransactionDto transactionDto) {
        Transaction transaction = new Transaction();
        transaction.setId(transactionDto.getId());
        transaction.setName(transactionDto.getName());
        transaction.setMoney(transactionDto.getMoney());
        transaction.setSplit(splitRepository.findSplitById(transactionDto.getSplit()).orElseThrow());
        transaction.setPositions(positionRepository.findPositionsByIds(transactionDto.getPositions()));
        return transaction;
    }

    public TransactionDto toDto(Transaction transaction) {
        TransactionDto transactionDto = new TransactionDto();
        transactionDto.setId(transaction.getId());
        transactionDto.setName(transaction.getName());
        transactionDto.setMoney(transaction.getMoney());
        transactionDto.setSplit(transaction.getSplit().getId());
        transactionDto.setPositions(transaction.getPositions().stream()
                .map(Position::getId)
                .collect(Collectors.toList()));
        return transactionDto;
    }
}
