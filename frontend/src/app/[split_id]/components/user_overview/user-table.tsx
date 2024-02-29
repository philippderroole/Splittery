import { AppEnvironment } from "@/types/app-environment";
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import Currency from "../Currency";
import {
    getAmountDue,
    getAmountOutstanding,
    getAmountReceived,
    getAmountSpent,
} from "./balances";
import Tooltip from "./tooltip";
import UserActions from "./user-actions";

const spentTooltip = (
    <Tooltip text="The total amount of money spent by the user." />
);

const receivedTooltip = (
    <Tooltip text="The total amount of money received by the user." />
);

const dueTooltip = (
    <Tooltip text="The amount of money the user owes to the group." />
);
const outstandingTooltip = (
    <Tooltip text="The amount of money the user still has to receive from the group." />
);

export default function UserTable({
    app,
    size,
}: {
    app: AppEnvironment;
    size?: string[];
}) {
    const { users, transactions } = app;

    return (
        <TableContainer width={size}>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th paddingX={2}>User</Th>
                        <Th paddingX={2} isNumeric>
                            Spent
                            {spentTooltip}
                        </Th>
                        <Th paddingX={2} isNumeric>
                            Received
                            {receivedTooltip}
                        </Th>
                        <Th paddingX={2} isNumeric>
                            Due
                            {dueTooltip}
                        </Th>
                        <Th paddingX={2} isNumeric>
                            Outstanding
                            {outstandingTooltip}
                        </Th>
                        <Th paddingX={0}></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user) => (
                        <Tr key={user.id}>
                            <Td paddingX={2}>{user.name}</Td>
                            <Td paddingX={2} isNumeric>
                                <Currency
                                    amount={getAmountSpent(
                                        transactions,
                                        user.id
                                    )}
                                />
                            </Td>
                            <Td paddingX={2} isNumeric>
                                <Currency
                                    amount={getAmountReceived(
                                        transactions,
                                        user.id
                                    )}
                                />
                            </Td>
                            <Td paddingX={2} isNumeric>
                                <Currency
                                    amount={getAmountDue(
                                        transactions,
                                        users,
                                        user.id
                                    )}
                                />
                            </Td>
                            <Td paddingX={2} isNumeric>
                                <Currency
                                    amount={getAmountOutstanding(
                                        transactions,
                                        users,
                                        user.id
                                    )}
                                />
                            </Td>
                            <Td padding={0} isNumeric>
                                <UserActions app={app} user={user} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
