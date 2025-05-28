package de.splittery.backend.endpoints;

import de.splittery.backend.dtos.TransactionDto;
import de.splittery.backend.endpoints.exceptions.NotFoundException;
import de.splittery.backend.enitities.Split;
import de.splittery.backend.enitities.Transaction;
import de.splittery.backend.mappers.TransactionMapper;
import de.splittery.backend.repositories.SplitRepository;
import de.splittery.backend.repositories.TransactionRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
public class TransactionEndpoint {

    @Autowired
    private SplitRepository splitRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionMapper transactionMapper;

    @PostMapping("/splits/{splitId}/transactions")
    public TransactionDto createTransaction(@PathVariable long splitId, @RequestBody TransactionDto transactionDto) throws NotFoundException, BadRequestException {
        if (!Objects.equals(splitId, transactionDto.getSplit())) {
            throw new BadRequestException();
        }

        Split split = splitRepository.findById(splitId).orElseThrow(NotFoundException::new);

        Transaction transaction = transactionMapper.toEntity(transactionDto);
        if (!Objects.equals(transaction.getSplit().getId(), split.getId())) {
            throw new BadRequestException();
        }

        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    @GetMapping("/splits/{splitId}/transactions")
    public Collection<TransactionDto> getMultipleTransactions(@PathVariable long splitId) {
        return transactionRepository.getTransactionsBySplitId(splitId).stream()
                .map(transactionMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/splits/{splitId}/transactions/{id}")
    public TransactionDto getSplit(@PathVariable long splitId, @PathVariable long id) throws NotFoundException {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(NotFoundException::new);

        if (transaction.getSplit().getId() != splitId) {
            throw new NotFoundException();
        }

        return transactionMapper.toDto(transaction);
    }

    @PutMapping("/splits/{splitId}/transactions/{id}")
    public TransactionDto updateSplit(@PathVariable long splitId, @PathVariable long id, @RequestBody TransactionDto transactionDto) throws NotFoundException, BadRequestException {
        if (!Objects.equals(id, transactionDto.getId())) {
            throw new BadRequestException();
        }

        transactionRepository.findTransactionBySplitIdAndId(splitId, id).orElseThrow(NotFoundException::new);

        Transaction transaction = transactionMapper.toEntity(transactionDto);

        return transactionMapper.toDto(transactionRepository.save(transaction));
    }

    @DeleteMapping("/splits/{splitId}/transactions/{id}")
    public void deleteSplit(@PathVariable long splitId, @PathVariable long id) throws NotFoundException {
        transactionRepository.findTransactionBySplitIdAndId(splitId, id).orElseThrow(NotFoundException::new);

        transactionRepository.deleteById(id);
    }
}
