"use server";

import { CurrencyFormat } from "@/services/CurrencyFormat";
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
import LayoutBox from "../layout_box";
import AddUserButton from "./add_user_button";
import DeleteUserButton from "./delete_user_button";
import RenameUserButton from "./rename_user_button";

export default async function UserOverview({ split, users, transactions }) {
    function getTotalAmountSpent(transactions) {
        return transactions.reduce(
            (acc, transaction) => acc - transaction.amount,
            0
        );
    }

    function getAmountSpent(transactions, user_id: number) {
        return transactions
            .filter((transaction) => transaction.user_id === user_id)
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc - transaction.amount, 0);
    }

    function getAmountReceived(transactions, user_id: number) {
        return transactions
            .filter((transaction) => transaction.user_id === user_id)
            .filter((transaction) => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
    }

    function getAmountLent(transactions, users, user_id: number) {
        const total = getTotalAmountSpent(transactions);
        const share_per_user = total / users.length;

        const spent = getAmountSpent(transactions, user_id);
        const received = getAmountReceived(transactions, user_id);
        const user_total = spent + received;

        if (user_total < share_per_user) {
            return 0;
        }

        return user_total - share_per_user;
    }

    function getAmountDue(transactions, users, user_id: number) {
        const total = getTotalAmountSpent(transactions);
        const share_per_user = total / users.length;

        const spent = getAmountSpent(transactions, user_id);
        const received = getAmountReceived(transactions, user_id);
        const user_total = spent + received;

        if (user_total > share_per_user) {
            return 0;
        }

        return user_total + share_per_user;
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
                            <Th>Due</Th>
                            <Th>Lent</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user.id}>
                                <Td>{user.name}</Td>
                                <Td isNumeric>
                                    {CurrencyFormat.format(
                                        getAmountSpent(transactions, user.id)
                                    )}
                                </Td>
                                <Td isNumeric>
                                    {CurrencyFormat.format(
                                        getAmountReceived(transactions, user.id)
                                    )}
                                </Td>
                                <Td isNumeric>
                                    {CurrencyFormat.format(
                                        getAmountDue(
                                            transactions,
                                            users,
                                            user.id
                                        )
                                    )}
                                </Td>
                                <Td isNumeric>
                                    {CurrencyFormat.format(
                                        getAmountLent(
                                            transactions,
                                            users,
                                            user.id
                                        )
                                    )}
                                </Td>
                                <Td padding={0}>
                                    <RenameUserButton
                                        user={user}
                                        users={users}
                                    />
                                    <DeleteUserButton
                                        user={user}
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
                    {CurrencyFormat.format(getTotalAmountSpent(transactions))}
                </Heading>
                <Text opacity={0.7} fontSize="sm">
                    Total Spent
                </Text>
            </Box>
        );
    }

    return (
        <LayoutBox name="Overview">
            <UsersTable />
            <TableFooter />
        </LayoutBox>
    );
}
