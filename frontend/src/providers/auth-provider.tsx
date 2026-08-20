import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthPayload {
    email: string;
    password: string;
    username?: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

const AuthContext = createContext({
    loginUser: async (payload: AuthPayload): Promise<boolean> => false,
    registerUser: async (payload: AuthPayload): Promise<boolean> => false,
    registerAnonymousUser: async (): Promise<boolean> => false,
    logoutUser: async (): Promise<boolean> => false,
    changePassword: async (payload: ChangePasswordPayload): Promise<boolean> => false,
    isAuthenticated: false,
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        isUserAuthenticated();
    }, []);

    const isUserAuthenticated = async (): Promise<void> => {
        console.log("Checking if user is authenticated...");

        fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/me`, {
            method: "GET",
            credentials: "include",
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Failed to check authentication status.");
            }
            setIsAuthenticated(true);
        }).catch((error) => {
            setIsAuthenticated(false);
        });
    };

    const registerUser = async (payload: AuthPayload): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                username: payload.username,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to register user.");
                }
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                setIsAuthenticated(false);
                return false;
            });
    };

    const registerAnonymousUser = async (): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/anonymous`, {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to register anonymous user.");
                }
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                setIsAuthenticated(false);
                return false;
            });
    };

    const loginUser = async (payload: AuthPayload): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to log in.");
                }
                setIsAuthenticated(true);
                return true;
            })
            .catch((error) => {
                setIsAuthenticated(false);
                return false;
            });
    };

    const logoutUser = async (): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to log out.");
                }
                setIsAuthenticated(false);
                return true;
            })
            .catch((error) => {
                return false;
            });
    };

    const changePassword = async (payload: ChangePasswordPayload): Promise<boolean> => {
        return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/password/change`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                current_password: payload.currentPassword,
                new_password: payload.newPassword,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to change password.");
                }
                return true;
            })
            .catch((error) => {
                return false;
            });
    };

    return (
        <AuthContext.Provider
            value={{
                loginUser,
                registerUser,
                registerAnonymousUser,
                logoutUser,
                changePassword,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
