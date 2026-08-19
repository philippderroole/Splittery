import React, { createContext, useContext, useState } from "react";

export interface AuthPayload {
    email: string;
    password: string;
    username?: string;
}

const AuthContext = createContext({
    loginUser: async (payload: AuthPayload): Promise<boolean> => false,
    registerUser: async (payload: AuthPayload): Promise<boolean> => false,
    registerAnonymousUser: async (): Promise<boolean> => false,
    isAuthenticated: false,
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const registerUser = async (payload: AuthPayload): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/register`, {
            method: "POST",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                username: payload.username,
            }),
        })
            .then(() => {
                console.log("User registered successfully.");
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                console.error("Error registering user:", error);
                return false;
            });
    };

    const registerAnonymousUser = async (): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/anonymous/register`, {
            method: "POST",
        })
            .then(() => {
                console.log("Anonymous user registered successfully.");
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                console.error("Error registering anonymous user:", error);
                return false;
            });
    };

    const loginUser = async (payload: AuthPayload): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/login`, {
            method: "POST",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
            }),
        })
            .then(() => {
                console.log("User logged in successfully.");
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                return false;
            });
    };

    return (
        <AuthContext.Provider value={{ loginUser, registerUser, registerAnonymousUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
