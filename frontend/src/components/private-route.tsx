import { useAuth } from "@/providers/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        console.log("User is not authenticated. Redirecting to home page.");
        return <Navigate to="/" />;
    }
    return <Outlet />;
};
