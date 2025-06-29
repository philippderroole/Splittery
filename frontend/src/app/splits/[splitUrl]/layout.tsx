import "server-only";

import NavTabs from "@/components/nav-tabs";
import SplitHeader from "@/components/split-header";
import { TransactionsProvider } from "@/providers/transactions-provider";
import { getSplit } from "@/service/split-service";
import { getTransactions } from "@/service/transaction-service";
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

    const serializedTransactions = await getTransactions(split.url);

    return (
        <div>
            <SplitProvider split={split}>
                <TransactionsProvider
                    serializedTransactions={serializedTransactions}
                    splitUrl={splitUrl}
                >
                    <SplitHeader />
                    {children}
                </TransactionsProvider>
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
