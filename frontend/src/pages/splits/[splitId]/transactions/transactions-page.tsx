import {
    CreateSettlementDialogButton,
    CreateTransactionDialogButton,
} from "./components/create-transaction-dialog";
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
                <div style={{ display: "flex", gap: "1rem" }}>
                    <CreateSettlementDialogButton />
                    <CreateTransactionDialogButton />
                </div>
            </div>
        </>
    );
}
