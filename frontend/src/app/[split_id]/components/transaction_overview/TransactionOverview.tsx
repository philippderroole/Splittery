"use server";

import { Transaction } from "@/types/transaction";
import {
    Flex,
    Hide,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Show,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Currency from "../Currency";
import LayoutBox from "../LayoutBox";
import CreateTransactionButton from "./CreateTransactionButton";
import DeleteTransactionButton from "./DeleteTransactionButton";
import EditTransactionButton from "./EditTransactionButton";

export default async function TransactionOverview({
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
    const buttons = (transaction) => (
        <>
            <Show above="sm">
                <EditTransactionButton
                    split_id={split.id}
                    transaction={transaction}
                    users={users}
                />
                <DeleteTransactionButton
                    split_id={split.id}
                    transaction={transaction}
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
                            <EditTransactionButton
                                split_id={split.id}
                                transaction={transaction}
                                users={users}
                            />
                            <DeleteTransactionButton
                                split_id={split.id}
                                transaction={transaction}
                                transactions={transactions}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Hide>
        </>
    );

    const transactionTable = (
        <TableContainer>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th paddingX={4}>Title</Th>
                        <Th paddingX={4} isNumeric>
                            Amount
                        </Th>
                        <Th paddingX={4}>User</Th>
                        <Th paddingX={0} isNumeric></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {transactions.map((transaction) => (
                        <Tr key={transaction.id}>
                            <Td paddingX={2} whiteSpace="wrap">
                                {transaction.title}
                            </Td>
                            <Td paddingX={2} isNumeric>
                                <Currency
                                    textColor={
                                        transaction.amount < 0
                                            ? "red.300"
                                            : "green.300"
                                    }
                                    amount={transaction.amount}
                                />
                            </Td>
                            <Td paddingX={2}>
                                {
                                    users.find(
                                        (user) =>
                                            user.id === transaction.user_id
                                    ).name
                                }
                            </Td>
                            <Td padding={0} isNumeric>
                                {buttons(transaction)}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );

    const tableFooter = (
        <Flex
            paddingTop={3}
            direction="row"
            justifyContent="right"
            alignItems="center">
            <CreateTransactionButton
                split_id={split.id}
                users={users}></CreateTransactionButton>
        </Flex>
    );

    return (
        <LayoutBox name="Transactions" size={size}>
            {transactionTable}
            {tableFooter}
        </LayoutBox>
    );
}
