"use server";

import { CreateUser, SerializedTransaction } from "@/utils/transaction";
import { revalidatePath } from "next/cache";

export async function createUser(
    user: CreateUser,
    splitUrl: string
): Promise<SerializedTransaction> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitUrl}/users`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        }
    );

    if (!res.ok) {
        let errorMsg = res.statusText;
        try {
            const data = await res.json();
            if (data?.message) {
                errorMsg = data.message;
            } else if (typeof data === "string") {
                errorMsg = data;
            }
        } catch {
            // ignore JSON parse errors, fallback to statusText
        }
        throw new Error(errorMsg);
    }

    revalidatePath(
        `${process.env.APINEXT_PUBLIC_API_URL_URL}/splits/${splitUrl}/users`
    );

    return res.json();
}
