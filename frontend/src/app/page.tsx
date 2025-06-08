import "server-only";

import CreateSplitButton from "@/components/create-split-button";
import { Typography } from "@mui/material";

export default function HomePage() {
    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <CreateSplitButton />
        </>
    );
}
