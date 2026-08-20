import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

export default function AccountMenu() {
    const navigate = useNavigate();
    const { logoutUser, changePassword } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const menuOpen = Boolean(anchorEl);

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleCloseMenu();
        const isLoggedOut = await logoutUser();

        if (isLoggedOut) {
            navigate("/", { replace: true });
        }
    };

    const handleOpenChangePassword = () => {
        handleCloseMenu();
        setError(null);
        setSuccess(null);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setError(null);
        setSuccess(null);
    };

    const handleChangePassword = async () => {
        setError(null);
        setSuccess(null);

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError("Please fill out all fields.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        const isChanged = await changePassword({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
        });

        if (!isChanged) {
            setError("Could not change password. Please try again.");
            return;
        }

        setSuccess("Password changed successfully.");
        setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1200,
            }}
        >
            <IconButton
                size="large"
                color="primary"
                onClick={handleOpenMenu}
                aria-label="Open account menu"
            >
                <AccountCircleIcon fontSize="large" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleOpenChangePassword}>Change password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                <DialogTitle>Change password</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Current password"
                            type="password"
                            value={form.currentPassword}
                            onChange={(event) => {
                                setForm({ ...form, currentPassword: event.target.value });
                            }}
                        />
                        <TextField
                            label="New password"
                            type="password"
                            value={form.newPassword}
                            onChange={(event) => {
                                setForm({ ...form, newPassword: event.target.value });
                            }}
                        />
                        <TextField
                            label="Confirm new password"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(event) => {
                                setForm({ ...form, confirmPassword: event.target.value });
                            }}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleChangePassword}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
