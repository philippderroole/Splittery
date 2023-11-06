"use client";

import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

import { ActivityContext } from "@/lib/ActivityProvider";
import Utils from "@/lib/utils";
import { useContext } from "react";
import DeleteUser from "./DeleteUser";

export default function BalancesTable() {
    const activity_state = useContext(ActivityContext);

    type UserBalances = {
        user: User;
        amount: number;
    };

    function getOverallBalances() {
        let userBalances: UserBalances[] = [];

        activity_state.users.forEach((user) => {
            userBalances.push({
                user: user,
                amount: 0,
            });
        });

        let balances = activity_state.activity.expenses.flatMap(
            (expense) => expense.balances
        );

        balances.forEach((balance) => {
            let overallBalance = userBalances.find(
                (userBalance) =>
                    userBalance.user.name === balance.user.name &&
                    userBalance.user.activity.id === balance.user.activity.id
            );

            if (overallBalance) {
                overallBalance.amount += balance.amount;
            }
        });

        userBalances.forEach((userBalance) => {
            userBalance.amount = Utils.rountToDecimals(userBalance.amount, 2);
        });

        return userBalances;
    }

    return (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>User</Th>
                        <Th isNumeric>Amount</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {getOverallBalances().map((share) => (
                        <Tr key={share.user.name}>
                            <Td>{share.user.name}</Td>
                            <Td isNumeric>{share.amount} €</Td>
                            <Td textAlign="right">
                                <DeleteUser user={share.user} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
1;
