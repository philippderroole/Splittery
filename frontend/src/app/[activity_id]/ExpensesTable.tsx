import { SmallCloseIcon } from "@chakra-ui/icons";
import {
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

export default function ExpensesTable({ params }) {
    const expenses: Expense[] = [] as Expense[];

    async function deleteExpense(expense: Expense) {}

    return (
        <div>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Buyer</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {expenses?.map((expense) => (
                            <Tr key={expense.title} onClick={() => {}}>
                                <Td>{expense.title}</Td>
                                <Td isNumeric>{expense.amount}</Td>
                                <Td>{expense.user.name}</Td>
                                <Td textAlign="right">
                                    <IconButton
                                        aria-label={"delete expense"}
                                        icon={<SmallCloseIcon></SmallCloseIcon>}
                                        variant="unstyled"
                                        onClick={() => {
                                            deleteExpense(expense);
                                        }}></IconButton>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    );
}
