import "server-only";

import NavTabs from "@/app/components/nav-tabs";
import SplitHeader from "@/components/split-header";
import { SplitUserProvider } from "@/providers/split-user-provider";
import { TransactionsProvider } from "@/providers/transactions-provider";
import { getSplit } from "@/service/split-service";
import { getMembers } from "@/service/split-user-service";
import { getTransactions } from "@/service/transaction-service";
import { notFound } from "next/navigation";
import { SplitProvider } from "../../../providers/split-provider";

export default async function SplitLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ splitId: string }>;
}) {
    const { splitId } = await params;

    let split;
    let splitUsers;
    let serializedTransactions;

    try {
        split = await getSplit(splitId);
        splitUsers = await getMembers(splitId);
        serializedTransactions = await getTransactions(split.id);
    } catch (error) {
        console.error("Error fetching split data:", error);
        notFound();
    }

    return (
        <div>
            <SplitProvider split={split}>
                <TransactionsProvider
                    serializedTransactions={serializedTransactions}
                >
                    <SplitUserProvider splitUsers={splitUsers}>
                        <SplitHeader />
                        {children}
                    </SplitUserProvider>
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
