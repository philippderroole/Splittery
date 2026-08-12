import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../commands/login";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        await login(email, password)
            .then(() => {
                navigate("/splits");
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
                onClick={handleLogin}
            >
                Login
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
                <Typography>Don't have an account?</Typography>
                <Typography>
                    <Link href="/register" color="inherit">
                        Register here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
