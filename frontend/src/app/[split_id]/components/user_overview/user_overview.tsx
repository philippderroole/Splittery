"use server";

import { CurrencyFormat } from "@/services/CurrencyFormat";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
import LayoutBox from "../layout_box";
import CreateUserButton from "./create_user_button";
import DeleteUserButton from "./delete_user_button";
import EditUserButton from "./edit_user_button";

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

        if (spent > received) {
            return 0;
        }

        if (user_total + share_per_user < 0) {
            return 0;
        }

        return user_total + share_per_user;
    }

    const userTable = (
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
                                    getAmountDue(transactions, users, user.id)
                                )}
                            </Td>
                            <Td isNumeric>
                                {CurrencyFormat.format(
                                    getAmountLent(transactions, users, user.id)
                                )}
                            </Td>
                            <Td padding={0}>
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
        <Accordion width="2xs" allowMultiple>
            {users.map((user) => (
                <AccordionItem>
                    <h2 style={{ display: "flex", alignItems: "center" }}>
                        <AccordionButton as="div" paddingRight={0}>
                            {user.name}
                            <AccordionIcon />
                            <Spacer />
                            {CurrencyFormat.format(
                                getAmountDue(transactions, users, user.id)
                            )}
                        </AccordionButton>

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
                    </h2>
                    <AccordionPanel paddingBottom={4}>
                        <TableContainer>
                            <Table variant="simple">
                                <Tbody>
                                    <Tr>
                                        <Td paddingY={2}>Spent:</Td>
                                        <Td paddingY={2} isNumeric>
                                            {CurrencyFormat.format(
                                                getAmountSpent(
                                                    transactions,
                                                    user.id
                                                )
                                            )}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>Received:</Td>
                                        <Td paddingY={2} isNumeric>
                                            {CurrencyFormat.format(
                                                getAmountReceived(
                                                    transactions,
                                                    user.id
                                                )
                                            )}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>Due:</Td>
                                        <Td paddingY={2} isNumeric>
                                            {CurrencyFormat.format(
                                                getAmountDue(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )
                                            )}
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Td paddingY={2}>Lent:</Td>
                                        <Td paddingY={2} isNumeric>
                                            {CurrencyFormat.format(
                                                getAmountLent(
                                                    transactions,
                                                    users,
                                                    user.id
                                                )
                                            )}
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
        <>
            <Show above="md">
                <LayoutBox name="Overview">
                    {userTable}
                    {tableFooter}
                </LayoutBox>
            </Show>
            <Hide above="md">
                <LayoutBox name="Overview">
                    {userAccordion}
                    {tableFooter}
                </LayoutBox>
            </Hide>
        </>
    );
}
