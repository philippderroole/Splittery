import { invoke } from "@tauri-apps/api/core";

export async function login(email: string, password: string) {
    return invoke("login", { email, password });
}

export async function register(email: string, password: string) {
    return invoke("register", { email, password });
}
