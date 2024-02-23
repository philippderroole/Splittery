"use client";

import { revalidateTag } from "@/app/server_actions";
import { Transaction } from "@/app/types/transaction";
import { HttpService } from "@/services/HttpService";
import { validate_payer, validate_receiver } from "@/services/Validation";
import { AddIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import TransactionModal from "./TransactionModal";

export default function CreateTransactionButton({
    split_id,
    users,
}: {
    split_id: number;
    users: any[];
}) {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    async function handleCreateTransfer(
        amount: number,
        title: string,
        payerId: number,
        receiverId: number
    ) {
        try {
            let new_transaction1: Transaction = {
                title: title,
                amount: -amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response1 = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction1
            );

            let new_transaction2: Transaction = {
                title: title,
                amount: amount,
                user_id: users.find((user) => user.id === receiverId).id,
            };

            const response2 = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction2
            );

            revalidateTag("transactions");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateExpense(
        tabIndex: number,
        amount: number,
        title: string,
        payerId: number
    ) {
        if (validate_payer(tabIndex, payerId) != undefined) {
            return;
        }

        try {
            let new_transaction: Transaction = {
                title: title,
                amount: -amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction
            );

            revalidateTag("transactions");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateIncome(
        tabIndex: number,
        amount: number,
        title: string,
        payerId: number,
        receiverId: number
    ) {
        if (validate_receiver(tabIndex, payerId, receiverId) != undefined) {
            return;
        }

        try {
            let new_transaction: Transaction = {
                title: title,
                amount: amount,
                user_id: users.find((user) => user.id === payerId).id,
            };

            const response = await HttpService.POST(
                `/splits/${split_id}/transactions`,
                new_transaction
            );

            revalidateTag("transactions");
            close();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while creating transaction",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error creating transaction", error);
        }
    }

    async function handleCreateTransaction(
        tabIndex: number,
        amount: number,
        title: string,
        payerId: number,
        receiverId: number
    ) {
        switch (tabIndex) {
            case 0:
                await handleCreateExpense(tabIndex, amount, title, payerId);
                break;
            case 1:
                await handleCreateIncome(
                    tabIndex,
                    amount,
                    title,
                    payerId,
                    receiverId
                );
                break;
            case 2:
                await handleCreateTransfer(amount, title, payerId, receiverId);
                break;
        }
    }

    const createTransactionButton = (
        <IconButton
            colorScheme="green"
            borderRadius="full"
            icon={<AddIcon />}
            aria-label={"add transaction"}
            onClick={() => {
                if (users.length === 0) {
                    toast({
                        title: "Can't create transaction",
                        description: "Please create a user first",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    onOpen();
                }
            }}></IconButton>
    );

    return (
        <>
            {createTransactionButton}
            <TransactionModal
                header="Create a new Transaction"
                split_id={split_id}
                users={users}
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                onSubmit={handleCreateTransaction}
            />
        </>
    );
}
