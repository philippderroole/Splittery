import { POST } from "@/utils/request";

export interface AuthPayload {
    email: string;
    password: string;
    username?: string;
}

export async function registerUser(payload: AuthPayload): Promise<unknown> {
    return await POST(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/register`, {
        body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            username: payload.username ?? payload.email.split("@")[0],
        }),
    });
}

export async function loginUser(payload: AuthPayload): Promise<unknown> {
    return await POST(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/web/password/login`, {
        body: JSON.stringify({
            email: payload.email,
            password: payload.password,
        }),
    });
}
