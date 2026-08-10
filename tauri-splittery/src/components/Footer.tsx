import HomeIcon from "@mui/icons-material/Home";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentValue = () => {
        if (location.pathname === "/") return 0;
        if (location.pathname.startsWith("/plants")) return 1;
        return 0;
    };

    return (
        <Paper
            sx={{
                flex: "0 0 auto",
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: 72,
                boxSizing: "border-box",
                overflow: "hidden",
                zIndex: (theme) => theme.zIndex.appBar,
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={getCurrentValue()}
                onChange={(_, newValue) => {
                    if (newValue === 0) navigate("/");
                    if (newValue === 1) navigate("/plants");
                }}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction
                    label="My Plants"
                    icon={<LocalFloristIcon />}
                />
            </BottomNavigation>
        </Paper>
    );
}
