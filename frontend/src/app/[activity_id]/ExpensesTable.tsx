import { HttpService } from "@/services/HttpService";
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import DeleteExpense from "./DeleteExpense";

export default async function ExpensesTable({ params }) {
    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const expenses: Expense[] = await getAllExpenses(activity);

    async function getAllExpenses(activity: Activity): Promise<Expense[]> {
        return HttpService.POST("/expense/getAll", activity, "no-store");
    }

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
                    {expenses?.map((expense) => (
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
