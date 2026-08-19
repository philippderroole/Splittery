import { CreateTransactionDialogButton } from "./components/create-transaction-dialog";
import TransactionList from "./components/transaction-list";

export default function TransactionGroupListPage() {
    return (
        <>
            <TransactionList />

            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateTransactionDialogButton />
            </div>
        </>
    );
}
