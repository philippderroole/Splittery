"use client";

import { EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default async function RenameTransactionButton() {
    return (
        <>
            <IconButton
                icon={<EditIcon></EditIcon>}
                aria-label="rename"
                variant="ghost"></IconButton>
        </>
    );
}
