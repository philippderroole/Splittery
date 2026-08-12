import { Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import SplitOverviewPage from "./pages/split-overview/SplitOverviewPage";
import { SplitsProvider } from "./providers/splits-provider";

export default function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <BrowserRouter>
                <Box
                    sx={{
                        height: {
                            xs: "calc(100dvh - 56px - max(12px, env(safe-area-inset-bottom)))",
                            sm: "calc(100vh - 56px + env(safe-area-inset-bottom))",
                        },
                        overflowX: "hidden",
                        overflowY: "auto",
                        overscrollBehaviorY: "contain",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route
                            path="/splits"
                            element={
                                <SplitsProvider>
                                    <SplitOverviewPage />
                                </SplitsProvider>
                            }
                        />
                    </Routes>
                </Box>
            </BrowserRouter>
        </LocalizationProvider>
    );
}
