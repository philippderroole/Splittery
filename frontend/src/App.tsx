import { Box, CircularProgress, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import HomePage from "./app/page";
import SplitBalancesPage from "./app/splits/[splitId]/balances/page";
import SplitTagsPage from "./app/splits/[splitId]/tags/page";
import SplitTransactionsPage from "./app/splits/[splitId]/transactions/page";
import SplitTransactionLayout from "./app/splits/[splitId]/transactions/[transactionId]/layout";
import SplitTransactionPage from "./app/splits/[splitId]/transactions/[transactionId]/page";
import SplitLayout from "./app/splits/[splitId]/layout";

function AppLoading() {
    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <CircularProgress />
        </Box>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/splits/:splitId"
                element={
                    <SplitLayout>
                        <AppLoading />
                    </SplitLayout>
                }
            />
            <Route
                path="/splits/:splitId/balances"
                element={
                    <SplitLayout>
                        <SplitBalancesPage />
                    </SplitLayout>
                }
            />
            <Route
                path="/splits/:splitId/tags"
                element={
                    <SplitLayout>
                        <SplitTagsPage />
                    </SplitLayout>
                }
            />
            <Route
                path="/splits/:splitId/transactions"
                element={
                    <SplitLayout>
                        <SplitTransactionsPage />
                    </SplitLayout>
                }
            />
            <Route
                path="/splits/:splitId/transactions/:transactionId"
                element={
                    <SplitLayout>
                        <SplitTransactionLayout>
                            <SplitTransactionPage />
                        </SplitTransactionLayout>
                    </SplitLayout>
                }
            />
            <Route
                path="*"
                element={
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4">Page not found</Typography>
                    </Box>
                }
            />
        </Routes>
    );
}

export default App;