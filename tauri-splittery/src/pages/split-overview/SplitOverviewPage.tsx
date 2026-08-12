import { Typography } from "@mui/material";
import { useSplits } from "../../providers/splits-provider";
import { CreateSplitDialogButton } from "./components/create-split-dialog-button";

export default function SplitOverviewPage() {
    const { splits } = useSplits();

    return (
        <>
            <Typography variant="h1">Splittery</Typography>
            <CreateSplitDialogButton />
            {splits.map((split) => (
                <Typography key={split.id} variant="h2">
                    {split.name}
                </Typography>
            ))}
        </>
    );
}
