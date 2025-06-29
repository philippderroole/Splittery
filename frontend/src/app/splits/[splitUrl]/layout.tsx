import "server-only";

import NavTabs from "@/components/nav-tabs";
import SplitHeader from "@/components/split-header";
import { getSplit } from "@/service/split-service";
import { notFound } from "next/navigation";
import { SplitProvider } from "../../../providers/split-provider";

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
            <SplitProvider split={split}>
                <SplitHeader />
                {children}
            </SplitProvider>
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
