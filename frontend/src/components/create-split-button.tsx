"use client";

import { createSplit } from "@/app/actions/create-split-service";
import { Button } from "@mui/material";

export default function CreateSplitButton() {
    return (
        <Button
            onClick={async () => {
                const split = await createSplit();
                window.location.href = `/splits/${split.url}/transactions`;
            }}
        >
            Create Split
        </Button>
    );
}
