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

export default function DeleteUser({ user }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const toast = useToast();
    const cancelRef = useRef(null);

    const deleteUser = async () => {
        HttpService.DELETE("/user/delete", user)
            .then(() => {
                toast({
                    title: "User deleted.",
                    description: `${user.name} deleted successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                router.refresh();
                onClose();
            })
            .catch(() => {
                toast({
                    title: "Failed to delete user.",
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
                aria-label={"delete user"}
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
                            Delete User
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete {user.name}? <br />
                            This action is permanent and cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter gap="0.3vw">
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={deleteUser}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
