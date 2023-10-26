"use client";

import { HttpService } from "@/services/HttpService";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function DeleteUser({ user }) {
    const router = useRouter();
    const toast = useToast();

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
        <IconButton
            aria-label={"delete user"}
            variant="ghost"
            icon={<DeleteIcon />}
            onClick={() => deleteUser()}></IconButton>
    );
}
