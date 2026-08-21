import { useAuth } from "@/providers/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};
