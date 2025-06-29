import "server-only";

import { TransactionProvider } from "@/providers/transaction-provider";
import { getTransaction } from "@/service/transaction-service";
import { SerializedTransaction } from "@/utils/transaction";

export default async function SplitLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ splitUrl: string; transactionUrl: string }>;
}) {
    const { splitUrl, transactionUrl } = await params;

    const serializedTransaction: SerializedTransaction = await getTransaction(
        splitUrl,
        transactionUrl
    );

    return (
        <div>
            <TransactionProvider
                serializedTransaction={serializedTransaction}
                splitUrl={splitUrl}
            >
                {children}
            </TransactionProvider>
        </div>
    );
}
