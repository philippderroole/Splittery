import { POST } from "@/utils/request";

export async function registerAnonymous(): Promise<string> {
    return await POST(`${import.meta.env.VITE_INTERNAL_API_URL}/auth/anonymous`, {
        body: JSON.stringify({}),
    });
}
