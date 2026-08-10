import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function RegisterPage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleRegister(
        username: string,
        email: string,
        password: string,
    ) {
        await fetch(`${apiUrl}/auth/password/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: "2rem",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    width: "100%",
                }}
            >
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    sx={{ width: "100%", height: "3rem" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Username"
                    variant="outlined"
                    sx={{ width: "100%", height: "3rem" }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    sx={{ width: "100%", height: "3rem" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Box>
            <Button
                variant="contained"
                sx={{ width: "100%", height: "3rem", textTransform: "none" }}
                onClick={() => handleRegister(username, email, password)}
            >
                Register
            </Button>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                }}
            >
                <Typography>Already have an account?</Typography>
                <Typography>
                    <Link href="/login" color="inherit">
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
