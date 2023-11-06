import { ActivityContext } from "@/lib/ActivityProvider";
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useContext } from "react";
import DeleteExpense from "./DeleteExpense";

export default async function ExpensesTable() {
    const activity_state = useContext(ActivityContext);

    return (
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
                    {activity_state.activity.expenses?.map((expense) => (
                        <Tr key={expense.name}>
                            <Td>{expense.name}</Td>
                            <Td isNumeric>{expense.amount}</Td>
                            <Td>{expense.user?.name}</Td>
                            <Td textAlign="right">
                                <DeleteExpense expense={expense} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
