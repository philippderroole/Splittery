import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

function getReturnPath(): string | null {
    const returnTo = new URLSearchParams(window.location.search).get("returnTo");

    if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
        return returnTo;
    }

    return null;
}

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated, loginUser, registerUser, registerAnonymousUser } = useAuth();
    const [mode, setMode] = useState<"register" | "login" | "guest">("register");
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const returnTo = getReturnPath();

    const redirectAfterAuth = () => {
        if (returnTo) {
            navigate(returnTo, { replace: true });
            return;
        }

        navigate("/splits", { replace: true });
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        if (mode === "login") {
            const isAuthenticated = await loginUser({ email: form.email, password: form.password });
            if (isAuthenticated) {
                setSuccess("Logged in successfully.");
                redirectAfterAuth();
            } else {
                setError("Login failed. Please check your email and password.");
                return;
            }
        } else {
            const isRegistered = await registerUser({
                email: form.email,
                password: form.password,
                username: form.username,
            });
            if (isRegistered) {
                setSuccess("Account created successfully.");
                redirectAfterAuth();
            } else {
                setError("Registration failed. Please try again.");
                return;
            }
        }
    };

    const handleSkip = async () => {
        setError(null);
        setSuccess(null);

        await registerAnonymousUser();
        if (isAuthenticated) {
            setSuccess("Continuing without an account.");
            redirectAfterAuth();
            return;
        } else {
            setError("Could not continue as a guest. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                display: "grid",
                placeItems: "center",
                bgcolor: "#f5f7fb",
                p: 3,
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                }}
            >
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h3" fontWeight={700} align="center">
                            Splittery
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="center">
                            Manage shared expenses with less friction.
                        </Typography>
                    </Box>

                    {!isAuthenticated ? (
                        <>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    fullWidth
                                    variant={mode === "register" ? "contained" : "outlined"}
                                    onClick={() => setMode("register")}
                                >
                                    Register
                                </Button>
                                <Button
                                    fullWidth
                                    variant={mode === "login" ? "contained" : "outlined"}
                                    onClick={() => setMode("login")}
                                >
                                    Login
                                </Button>
                            </Stack>

                            <Stack spacing={2}>
                                {mode === "register" && (
                                    <TextField
                                        label="Username"
                                        value={form.username}
                                        onChange={(event) => setForm({ ...form, username: event.target.value })}
                                    />
                                )}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                                />
                            </Stack>

                            {error && <Alert severity="error">{error}</Alert>}
                            {success && <Alert severity="success">{success}</Alert>}

                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                            >
                                {mode === "login" ? "Login" : "Register"}
                            </Button>

                            <Button
                                variant="text"
                                color="inherit"
                                onClick={handleSkip}
                            >
                                Skip registration
                            </Button>
                        </>
                    ) : null}
                </Stack>
            </Paper>
        </Box>
    );
}
