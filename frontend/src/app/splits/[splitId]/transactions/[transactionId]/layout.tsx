import { TransactionProvider } from "@/providers/transaction-provider";
import { useParams } from "react-router-dom";

export default function SplitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { transactionId } = useParams();

    if (!transactionId) {
        return null;
    }

    return (
        <div>
            <TransactionProvider transactionId={transactionId}>
                {children}
            </TransactionProvider>
        </div>
    );
}
