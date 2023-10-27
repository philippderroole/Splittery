"use client";

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
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function DeleteExpense({ expense }: { expense: Expense }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const toast = useToast();
    const cancelRef = useRef(null);

    const deleteExpense = async () => {
        HttpService.DELETE("/expense/delete", expense)
            .then(() => {
                toast({
                    title: "Expense deleted.",
                    description: `${expense.name} deleted successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                router.refresh();
                onClose();
            })
            .catch(() => {
                toast({
                    title: "Failed to delete expense.",
                    description: "Something went wrong.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <>
            <IconButton
                aria-label={"delete expense"}
                variant="ghost"
                icon={<DeleteIcon />}
                onClick={onOpen}></IconButton>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
                isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Expense
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete {expense.name}?{" "}
                            <br />
                            This action is permanent and cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter gap="0.3vw">
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={deleteExpense}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
