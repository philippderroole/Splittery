import "server-only";

import { TransactionProvider } from "@/providers/transaction-provider";

export default async function SplitLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ splitUrl: string; transactionUrl: string }>;
}) {
    const { transactionUrl } = await params;

    return (
        <div>
            <TransactionProvider transactionUrl={transactionUrl}>
                {children}
            </TransactionProvider>
        </div>
    );
}
