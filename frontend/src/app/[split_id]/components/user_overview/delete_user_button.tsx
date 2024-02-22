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

export default function DeleteUserButton({
    split_id,
    user,
    transactions,
}: {
    split_id: number;
    user: any;
    transactions: any[];
}) {
    const toast = useToast();
    const cancelRef = React.useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    function validateDeletion() {
        for (let transaction of transactions) {
            if (transaction.user_id === user.id) {
                toast({
                    title: user.name + " cannot be deleted",
                    description: "User still has transactions",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return false;
            }
        }

        return true;
    }

    function handleBeforeDeleteUser() {
        if (!validateDeletion()) {
            return;
        }

        onOpen();
    }

    async function handleDeleteUser() {
        try {
            const response = await HttpService.DELETE(
                `/splits/${split_id}/users/${user.id}`
            );

            revalidateTag("users");
            onClose();
        } catch (error) {
            toast({
                title: "Unexpected error occurred while deleting user",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error deleting user", error);
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
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete {user.name}?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteUser}
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
                onClick={handleBeforeDeleteUser}></IconButton>

            {dialog()}
        </>
    );
}
