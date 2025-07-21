"use server";

import { POST } from "@/utils/request";

export async function registerAnonymous(): Promise<string> {
    return await POST(`${process.env.NEXT_PUBLIC_API_URL}/auth/anonymous`, {
        body: JSON.stringify({}),
    });
}
