package de.splittery.backend.mappers;

import de.splittery.backend.dtos.PositionDto;
import de.splittery.backend.enitities.Position;
import de.splittery.backend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PositionMapper implements Mapper<PositionDto, Position> {

    @Autowired
    private TransactionRepository transactionRepository;

    public Position toEntity(PositionDto positionDto) {
        Position position = new Position();
        position.setId(positionDto.getId());
        position.setMoney(positionDto.getMoney());
        position.setExpense(transactionRepository.getTransactionById(positionDto.getExpense()));
        return position;
    }

    public PositionDto toDto(Position position) {
        PositionDto positionDto = new PositionDto();
        positionDto.setId(position.getId());
        positionDto.setMoney(position.getMoney());
        positionDto.setExpense(position.getExpense().getId());
        return positionDto;
    }
}
