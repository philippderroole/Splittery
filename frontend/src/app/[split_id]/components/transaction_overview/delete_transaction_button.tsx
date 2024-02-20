"use client";

import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default async function DeleteTransactionButton() {
    return (
        <>
            <IconButton
                icon={<DeleteIcon></DeleteIcon>}
                variant="ghost"
                aria-label="rename"></IconButton>
        </>
    );
}
