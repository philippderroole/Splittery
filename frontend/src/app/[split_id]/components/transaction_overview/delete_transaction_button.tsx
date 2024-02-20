"use client";

import { revalidateTag } from "@/app/server_actions";
import { HttpService } from "@/services/HttpService";
import { DeleteIcon } from "@chakra-ui/icons";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    IconButton,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import React from "react";

export default function DeleteTransactionButton({
    split_id,
    transaction,
    transactions,
}: {
    split_id: number;
    transaction: any;
    transactions: any[];
}) {
    const toast = useToast();
    const cancelRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    function validateDeletion() {
        return true;
    }

    function handleBeforeDeleteTransaction() {
        if (!validateDeletion()) {
            return;
        }

        onOpen();
    }

    async function handleDeleteTransaction() {
        try {
            const response = await HttpService.DELETE(
                `/splits/${split_id}/transactions/${transaction.id}`
            );

            revalidateTag("transactions");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while deleting transaction",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error deleting transaction", error);
        }
    }

    const dialog = () => {
        return (
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Transaction
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete {transaction.name}?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteTransaction}
                                ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        );
    };

    return (
        <>
            <IconButton
                icon={<DeleteIcon></DeleteIcon>}
                variant="ghost"
                aria-label="rename"
                onClick={handleBeforeDeleteTransaction}></IconButton>

            {dialog()}
        </>
    );
}
