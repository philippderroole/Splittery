"use server";

import { CurrencyFormat } from "@/services/CurrencyFormat";
import { Transaction } from "@/types/transaction";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Flex,
    Heading,
    Hide,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Show,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Currency from "../Currency";
import LayoutBox from "../LayoutBox";
import Tooltip from "./Tooltip";
import CreateUserButton from "./create_user_button";
import DeleteUserButton from "./delete_user_button";
import EditUserButton from "./edit_user_button";

export default async function UserOverview({
    split,
    users,
    transactions,
    size,
}: {
    split: any;
    users: any[];
    transactions: Transaction[];
    size?: string[];
}) {
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

    function getAmountOutstanding(transactions, users, user_id: number) {
        const total = getTotalAmountSpent(transactions);
        const share_per_user = total / users.length;

        const spent = getAmountSpent(transactions, user_id);
        const received = getAmountReceived(transactions, user_id);
        const user_total = spent - received;

        if (spent < received) {
            return 0;
        }

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
        const user_total = received - spent;

        if (user_total + share_per_user < 0) {
            return 0;
        }

        return user_total + share_per_user;
    }

    const buttons = (user) => (
        <>
            <Show above="sm">
                <EditUserButton split_id={split.id} user={user} users={users} />
                <DeleteUserButton
                    split_id={split.id}
                    user={user}
                    transactions={transactions}
                />
            </Show>
            <Hide above="sm">
                <Popover>
                    <PopoverTrigger>
                        <IconButton
                            icon={<MoreVertIcon />}
                            aria-label={""}
                            variant="link"
                            size="sm"
                        />
                    </PopoverTrigger>
                    <PopoverContent width={"fit-content"}>
                        <PopoverArrow />
                        <PopoverBody>
                            <EditUserButton
                                split_id={split.id}
                                user={user}
                                users={users}
                            />
                            <DeleteUserButton
                                split_id={split.id}
                                user={user}
                                transactions={transactions}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Hide>
        </>
    );

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

    const userTable = (
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
                                {buttons(user)}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );

    const total = (
        <Box>
            <Heading fontSize="3xl">
                {CurrencyFormat.format(getTotalAmountSpent(transactions))}
            </Heading>
            <Text opacity={0.7} fontSize="sm">
                Total Spent
            </Text>
        </Box>
    );

    const tableFooter = (
        <Flex
            paddingTop={3}
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            {total}
            <CreateUserButton
                split_id={split.id}
                users={users}></CreateUserButton>
        </Flex>
    );

    const userAccordion = (
        <Accordion allowMultiple>
            {users.map((user) => (
                <AccordionItem>
                    <h2 style={{ display: "flex", alignItems: "center" }}>
                        <AccordionButton as="div" paddingRight={0}>
                            {user.name}
                            <AccordionIcon />
                            <Spacer />
                            {getAmountDue(transactions, users, user.id) <= 0 &&
                            getAmountOutstanding(
                                transactions,
                                users,
                                user.id
                            ) <= 0 ? (
                                <Currency fontWeight="bold" amount={0} />
                            ) : null}
                            {getAmountDue(transactions, users, user.id) > 0 ? (
                                <Currency
                                    fontWeight="bold"
                                    amount={
                                        -getAmountDue(
                                            transactions,
                                            users,
                                            user.id
                                        )
                                    }
                                    textColor={"red.300"}
                                />
                            ) : null}
                            {getAmountOutstanding(
                                transactions,
                                users,
                                user.id
                            ) > 0 ? (
                                <Currency
                                    fontWeight="bold"
                                    amount={getAmountOutstanding(
                                        transactions,
                                        users,
                                        user.id
                                    )}
                                    textColor={"green.300"}
                                />
                            ) : null}
                        </AccordionButton>

                        {buttons(user)}
                    </h2>
                    <AccordionPanel paddingBottom={4}>
                        <TableContainer>
                            <Table variant="simple">
                                <Tbody>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Spent
                                            {spentTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountSpent(
                                                    transactions,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Received
                                            {receivedTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountReceived(
                                                    transactions,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Due
                                            {dueTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountDue(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>
                                            Outstanding
                                            {outstandingTooltip}
                                        </Td>
                                        <Td paddingY={2} isNumeric>
                                            <Currency
                                                amount={getAmountOutstanding(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )}
                                            />
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </AccordionPanel>
                </AccordionItem>
            ))}
        </Accordion>
    );

    return (
        <LayoutBox name="Overview" size={size}>
            <Show above="md">{userTable}</Show>
            <Hide above="md">{userAccordion}</Hide>
            {tableFooter}
        </LayoutBox>
    );
}
