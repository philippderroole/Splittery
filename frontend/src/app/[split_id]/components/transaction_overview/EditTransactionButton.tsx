"use client";

import { revalidateTag } from "@/app/server_actions";
import { Transaction } from "@/app/types/transaction";
import { HttpService } from "@/services/HttpService";
import { EditIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import TransactionModal from "./TransactionModal";

export default function EditTransactionButton({
    split_id,
    transaction,
    users,
}: {
    split_id: number;
    transaction: Transaction;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    async function handleEditExpense(
        title: string,
        amount: number,
        payerId: number
    ) {
        try {
            let new_transaction: Transaction = {
                title: title,
                amount: -amount,
                user_id: payerId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditIncome(
        title: string,
        amount: number,
        receiverId: number
    ) {
        try {
            let new_transaction: Transaction = {
                title: title,
                amount: amount,
                user_id: receiverId,
            };

            const response = await HttpService.PUT(
                `/splits/${split_id}/transactions/${transaction.id}`,
                new_transaction
            );

            revalidateTag("users");
            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while renaming transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error renaming transaction", error);
        }
    }

    async function handleEditTransaction(
        tabIndex: number,
        amount: number,
        title: string,
        payerId: number,
        receiverId: number
    ) {
        switch (tabIndex) {
            case 0:
                await handleEditExpense(title, amount, payerId);
                break;
            case 1:
                await handleEditIncome(title, amount, receiverId);
                break;
        }
    }

    return (
        <>
            <IconButton
                icon={<EditIcon></EditIcon>}
                aria-label="rename"
                variant="ghost"
                onClick={onOpen}></IconButton>
            <TransactionModal
                header={"Edit " + transaction.title}
                split_id={split_id}
                users={users}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                transaction={transaction}
                allowTransfer={false}
                onSubmit={handleEditTransaction}
            />
        </>
    );
}
