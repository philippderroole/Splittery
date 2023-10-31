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

import Utils from "@/lib/utils";
import DeleteUser from "./DeleteUser";

export default async function BalancesTable({ params }) {
    type UserBalances = {
        user: User;
        amount: number;
    };

    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const overallBalances: UserBalances[] = await getOverallBalances(activity);

    async function getAllUsers(activity: Activity): Promise<User[]> {
        return HttpService.POST("/user/getAll", activity, "no-store");
    }

    async function getExpenses(activity: Activity): Promise<Expense[]> {
        return HttpService.POST("/expense/getAll", activity, "no-store");
    }

    async function getOverallBalances(activity: Activity) {
        let users: User[] = await getAllUsers(activity);

        let userBalances: UserBalances[] = [];

        users.forEach((user) => {
            userBalances.push({
                user: user,
                amount: 0,
            });
        });

        let expenses: Expense[] = await getExpenses(activity);

        let balances = expenses.flatMap((expense) => expense.balances);

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
                    {overallBalances.map((share) => (
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
