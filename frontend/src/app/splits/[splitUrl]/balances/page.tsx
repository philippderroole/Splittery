import CreateUserButton from "@/components/create-user-button";
import { getSplit } from "@/service/split-service";
import { Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function SplitPage({
    params,
}: {
    params: Promise<{ splitUrl: string }>;
}) {
    const { splitUrl } = await params;

    let split;

    try {
        split = await getSplit(splitUrl);
    } catch {
        notFound();
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4">Balances</Typography>
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateUserButton split={split} />
            </div>
        </div>
    );
}
