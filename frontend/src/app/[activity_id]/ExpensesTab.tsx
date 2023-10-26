"use client";

import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import CreateExpense from "./CreateExpense";
import EditExpense from "./EditExpense";
import ExpensesTable from "./ExpensesTable";

export default function ExpensesTab({ params }) {
    const {
        isOpen: isOpenCreateExpense,
        onOpen: onOpenCreateExpense,
        onClose: onCloseCreateExpense,
    } = useDisclosure();
    const {
        isOpen: isOpenEditExpense,
        onOpen: onOpenEditExpense,
        onClose: onCloseEditExpense,
    } = useDisclosure();

    return (
        <div>
            <ExpensesTable params={params} />
            <Flex
                direction="row"
                justify="center"
                align="center"
                paddingTop="1vb">
                <Button
                    onClick={() => {
                        onOpenCreateExpense();
                    }}>
                    Add Expense
                </Button>
            </Flex>
            <CreateExpense
                params={params}
                isOpen={isOpenCreateExpense}
                onOpen={onOpenCreateExpense}
                onClose={onCloseCreateExpense}></CreateExpense>
            <EditExpense
                params={params}
                isOpen={isOpenEditExpense}
                onOpen={onOpenEditExpense}
                onClose={onCloseEditExpense}></EditExpense>
        </div>
    );
}
