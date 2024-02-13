"use server";

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
import AddTransactionButton from "./add_transaction_button";
import LayoutBox from "./layout_box";

export default async function TransactionOverview({ users, transactions }) {
    function TransactionTable() {
        return (
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Amount</Th>
                            <Th>Payer</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {transactions.map((transaction) => (
                            <Tr key={transaction.id}>
                                <Td>{transaction.name}</Td>
                                <Td isNumeric>{transaction.amount}€</Td>
                                <Td>
                                    {
                                        users.find(
                                            (user) =>
                                                user.id === transaction.user_id
                                        ).name
                                    }
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <LayoutBox>
            <TransactionTable />
            <Flex
                paddingTop={3}
                direction="row"
                justifyContent="right"
                alignItems="center">
                <AddTransactionButton
                    split_id={0}
                    users={[]}></AddTransactionButton>
            </Flex>
        </LayoutBox>
    );
}
