"use client";

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
    user,
    transactions,
}: {
    user: any;
    transactions: any[];
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);
    const toasts = useToast();

    function validateDeletion() {
        for (let transaction of transactions) {
            if (transaction.user_id === user.id) {
                toasts({
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

    function handleDeleteUser() {
        console.log("delete user");

        onClose();
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
