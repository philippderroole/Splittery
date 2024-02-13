"use server";

import {
    Box,
    Flex,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import AddUserButton from "./add_user_button";
import LayoutBox from "./layout_box";

export default async function UserOverview({ split, users, transactions }) {
    function getTotalAmountSpent(transactions) {
        return transactions.reduce(
            (acc, transaction) => acc + transaction.amount,
            0
        );
    }

    function getAmountSpent(transactions, user_id: number) {
        return transactions
            .filter((transaction) => transaction.user_id === user_id)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
    }

    function UsersTable() {
        return (
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>User</Th>
                            <Th>Spent</Th>
                            <Th>Received</Th>
                            <Th>Gets</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user.id}>
                                <Td>{user.name}</Td>
                                <Td isNumeric>
                                    {getAmountSpent(transactions, user.id)}€
                                </Td>
                                <Td isNumeric>0.00€</Td>
                                <Td isNumeric>0.00€</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        );
    }

    function TableFooter() {
        return (
            <Flex
                paddingTop={3}
                direction="row"
                justifyContent="space-between"
                alignItems="center">
                <Total amount={5} />
                <AddUserButton
                    split_id={split.id}
                    users={users}></AddUserButton>
            </Flex>
        );
    }

    function Total({ amount }: { amount: number }) {
        return (
            <Box>
                <Heading fontSize="3xl">
                    {getTotalAmountSpent(transactions)}€
                </Heading>
                <Text opacity={0.7} fontSize="sm">
                    Total Spent
                </Text>
            </Box>
        );
    }

    return (
        <LayoutBox>
            <UsersTable />
            <TableFooter />
        </LayoutBox>
    );
}
