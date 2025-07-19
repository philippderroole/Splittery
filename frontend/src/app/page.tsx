import "server-only";

import { Typography } from "@mui/material";
import { CreateSplitDialogButton } from "./components/create-split-dialog-button";

export default async function HomePage() {
    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <CreateSplitDialogButton />
        </>
    );
}
