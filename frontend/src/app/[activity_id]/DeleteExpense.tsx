"use client";

import { HttpService } from "@/services/HttpService";
import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function DeleteExpense({ expense }) {
    const router = useRouter();
    const toast = useToast();

    const deleteExpense = async () => {
        HttpService.DELETE("/expense/delete", expense)
            .then(() => {
                toast({
                    title: "Expense deleted.",
                    description: `${expense.title} deleted successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                router.refresh();
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
        <IconButton
            aria-label={"delete expense"}
            variant="ghost"
            icon={<DeleteIcon />}
            onClick={() => deleteExpense()}></IconButton>
    );
}
