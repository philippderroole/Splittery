import {
  CreateSettlementDialogButton,
  CreateTransactionDialogButton,
} from "./components/create-transaction-dialog";
import { Box } from "@mui/material";
import TransactionList from "./components/transaction-list";

export default function TransactionGroupListPage() {
  return (
    <>
      <TransactionList />

      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 80, sm: 96 },
          right: { xs: 16, sm: 32 },
          zIndex: 1200,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-end",
          }}
        >
          <CreateSettlementDialogButton />
          <CreateTransactionDialogButton />
        </Box>
      </Box>
    </>
  );
}
