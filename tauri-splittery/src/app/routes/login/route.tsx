import { TextField, Button, Box, Typography, Link } from "@mui/material";

export default function LoginPage() {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "2rem",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                width: "100%",
            }}>
                <TextField label="Username" variant="outlined" sx={{ width: "100%", height: "3rem" }} />
                <TextField label="Password" variant="outlined" type="password" sx={{ width: "100%", height: "3rem" }} />
            </Box>
            <Button variant="contained" sx={{ width: "100%", height: "3rem", textTransform: "none" }}>
                Login
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
                    Don't have an account?
                </Typography>
                <Typography>
                    <Link href="/register" color="inherit">Register here</Link>
                </Typography>
            </Box>
        </Box>
    );
}