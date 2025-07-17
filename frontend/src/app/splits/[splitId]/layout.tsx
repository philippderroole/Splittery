import "server-only";

import NavTabs from "@/app/components/nav-tabs";
import SplitHeader from "@/components/split-header";
import { SplitUserProvider } from "@/providers/split-user-provider";
import { TagsProvider } from "@/providers/tag-provider";
import { TransactionsProvider } from "@/providers/transactions-provider";
import { getSplit } from "@/service/split-service";
import { getMembersWithTags, getTags } from "@/service/tag-service";
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
    let tags;

    try {
        const values = await Promise.all([
            getSplit(splitId),
            getTags(splitId),
            getMembersWithTags(splitId),
            getTransactions(splitId),
        ]);

        split = values[0];
        tags = values[1];
        splitUsers = values[2];
        serializedTransactions = values[3];
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
                        <TagsProvider tags={tags}>
                            <SplitHeader />
                            {children}
                        </TagsProvider>
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
