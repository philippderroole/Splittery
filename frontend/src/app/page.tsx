"use client";

import { loginUser, registerUser } from "@/service/auth/auth-service";
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
import { CreateSplitDialogButton } from "./components/create-split-dialog-button";
import { registerAnonymous } from "@/service/auth/register-anonymous";

export default function HomePage() {
    const [mode, setMode] = useState<"register" | "login" | "guest">("register");
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setSuccess(null);

        try {
            if (mode === "login") {
                await loginUser({ email: form.email, password: form.password });
                setSuccess("Logged in successfully.");
            } else {
                await registerUser({
                    email: form.email,
                    password: form.password,
                    username: form.username,
                });
                setSuccess("Account created successfully.");
            }

            setIsAuthenticated(true);
        } catch {
            setError(
                mode === "login"
                    ? "Login failed. Please check your email and password."
                    : "Registration failed. Please try again."
            );
            setIsAuthenticated(false);
        }
    };

    const handleSkip = async () => {
        setError(null);
        setSuccess(null);

        try {
            await registerAnonymous();
            setIsAuthenticated(true);
            setMode("guest");
            setSuccess("Continuing without an account.");
        } catch {
            setMode("guest");
            setIsAuthenticated(true);
            setSuccess("Continuing without an account.");
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
                                        onChange={handleChange("username")}
                                    />
                                )}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange("password")}
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
                    ) : (
                        <Stack spacing={2}>
                            <Alert severity={mode === "guest" ? "info" : "success"}>
                                {mode === "guest"
                                    ? "You are continuing as a guest."
                                    : "You are signed in and ready to go."}
                            </Alert>
                            <CreateSplitDialogButton />
                        </Stack>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}
