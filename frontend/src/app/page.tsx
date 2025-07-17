import "server-only";

import { CreateSplitDialogButton } from "@/app/components/create-split-dialog";
import { Typography } from "@mui/material";

export default async function HomePage() {
    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <CreateSplitDialogButton />
        </>
    );
}
