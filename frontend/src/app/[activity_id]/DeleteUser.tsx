"use client";

import { HttpService } from "@/services/HttpService";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function DeleteUser({ user }) {
    const router = useRouter();

    const deleteUser = async () => {
        await HttpService.DELETE("/user/delete", user);

        router.refresh();
    };

    return (
        <IconButton
            aria-label={"delete user"}
            variant="ghost"
            icon={<DeleteIcon />}
            onClick={() => deleteUser()}></IconButton>
    );
}
