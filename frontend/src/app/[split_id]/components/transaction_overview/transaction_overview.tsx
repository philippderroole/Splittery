"use server";

import { CurrencyFormat } from "@/services/CurrencyFormat";
import {
    Flex,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import LayoutBox from "../layout_box";
import CreateTransactionButton from "./create_transaction_button";
import DeleteTransactionButton from "./delete_transaction_button";
import RenameTransactionButton from "./edit_transaction_button";

export default async function TransactionOverview({
    split,
    users,
    transactions,
}) {
    function TransactionTable() {
        return (
            <TableContainer width={["2xs", null, "xs"]}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Amount</Th>
                            <Th>User</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction) => (
                            <Tr key={transaction.id}>
                                <Td>{transaction.name}</Td>
                                <Td isNumeric>
                                    {CurrencyFormat.format(transaction.amount)}
                                </Td>
                                <Td>
                                    {
                                        users.find(
                                            (user) =>
                                                user.id === transaction.user_id
                                        ).name
                                    }
                                </Td>
                                <Td padding={0}>
                                    <RenameTransactionButton
                                        split_id={split.id}
                                        transaction={transaction}
                                        users={users}
                                    />
                                    <DeleteTransactionButton
                                        split_id={split.id}
                                        transaction={transaction}
                                        transactions={transactions}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <LayoutBox name="Transactions">
            <TransactionTable />
            <Flex
                paddingTop={3}
                direction="row"
                justifyContent="right"
                alignItems="center">
                <CreateTransactionButton
                    split_id={split.id}
                    users={users}></CreateTransactionButton>
            </Flex>
        </LayoutBox>
    );
}
