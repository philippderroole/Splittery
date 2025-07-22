import { Box, Dialog, useMediaQuery, useTheme } from "@mui/material";

interface MobileDialogProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export default function MobileDialog({
    open,
    onClose,
    children,
}: MobileDialogProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        ...(isMobile && {
                            position: "fixed",
                            top: "5%",
                            margin: "0 16px",
                            width: "calc(100% - 32px)",
                            maxWidth: "none",
                            borderRadius: 2,
                        }),
                    },
                },
            }}
        >
            <Box sx={{ minWidth: "380px" }}>{children}</Box>
        </Dialog>
    );
}
