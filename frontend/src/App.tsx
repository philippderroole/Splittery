import { Box, CircularProgress, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login-page";
import SplitsPage from "./pages/splits/split-page";
import SplitBalancesPage from "./pages/splits/[splitId]/balances/balances-page";
import SplitTagsPage from "./pages/splits/[splitId]/tags/page";
import SplitTransactionsPage from "./pages/splits/[splitId]/transactions/page";
import SplitTransactionLayout from "./pages/splits/[splitId]/transactions/[transactionId]/layout";
import SplitTransactionPage from "./pages/splits/[splitId]/transactions/[transactionId]/page";
import { SplitsProvider } from "./providers/splits-provider";
import PrivateRoute from "./components/private-route";
import { AuthProvider } from "./providers/auth-provider";
import SplitLayout from "./pages/splits/[splitId]/layout";
import LandingPage from "./pages/landing-page";

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

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/splits" element={
                        <SplitsProvider>
                            <SplitsPage />
                        </SplitsProvider>
                    } />
                </Route>
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
        </AuthProvider>
    );
}