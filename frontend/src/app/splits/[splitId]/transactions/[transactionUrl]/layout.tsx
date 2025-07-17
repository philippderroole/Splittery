import "server-only";

import { TransactionProvider } from "@/providers/transaction-provider";

export default async function SplitLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ splitId: string; transactionId: string }>;
}) {
    const { transactionId } = await params;

    return (
        <div>
            <TransactionProvider transactionId={transactionId}>
                {children}
            </TransactionProvider>
        </div>
    );
}
