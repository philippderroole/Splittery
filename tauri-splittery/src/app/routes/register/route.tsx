import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(username: string, password: string) {
        await invoke("register", { username, password });
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "2rem",
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    width: "100%",
                }}>
                <TextField
                    placeholder="Username"
                    variant="outlined"
                    slotProps={{
                        input: { notched: false },
                        htmlInput: { "aria-label": "Username" },
                    }}
                    sx={{
                        width: "100%",
                        height: "3rem",
                        "& .MuiOutlinedInput-notchedOutline legend": {
                            display: "none",
                        },
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    placeholder="Password"
                    variant="outlined"
                    type="password"
                    slotProps={{
                        input: { notched: false },
                        htmlInput: { "aria-label": "Password" },
                    }}
                    sx={{
                        width: "100%",
                        height: "3rem",
                        "& .MuiOutlinedInput-notchedOutline legend": {
                            display: "none",
                        },
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Box>
            <Button
                variant="contained"
                sx={{ width: "100%", height: "3rem", textTransform: "none" }}
                onClick={() => handleRegister(username, password)}
            >
                Register
            </Button>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
            }}>
                <Typography>
                    Already have an account?
                </Typography>
                <Typography>
                    <Link href="/login" color="inherit">Login here</Link>
                </Typography>
            </Box>
        </Box>
    );
}