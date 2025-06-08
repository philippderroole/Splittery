import NavTabs from "@/components/nav-tabs";
import { getSplit } from "@/service/split-service";
import { Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function SplitLayout({
    children,
    params,
}: {
    children: React.ReactNode;
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
        <div>
            <Typography variant="h2">Split {split.name}</Typography>
            {children}
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <NavTabs />
            </div>
        </div>
    );
}
