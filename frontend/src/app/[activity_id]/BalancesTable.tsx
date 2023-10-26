import { HttpService } from "@/services/HttpService";
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

export default async function BalancesTable({ params }) {
    const activity: Activity = {
        id: Array.isArray(params.activity_id)
            ? params.activity_id[0]
            : params.activity_id,
    };

    const overallBalances: Balance[] = await getOverallBalances(activity);

    async function getAllUsers(activity: Activity): Promise<User[]> {
        return HttpService.POST("/user/getAll", activity, "no-store");
    }

    async function getOverallBalances(activity: Activity) {
        let users: User[] = await getAllUsers(activity);
        let overallBalances: Balance[] = [];

        users.forEach((user) => {
            overallBalances.push({
                user: user,
                amount: 0,
                selected: false,
                share: 1,
            });
        });

        return overallBalances;
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

                            <Td isNumeric>{share.amount}</Td>
                            <Td textAlign="right">
                                <IconButton
                                    aria-label={"delete user"}
                                    variant="unstyled"></IconButton>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
1;
