"use server";

import { SerializedTransaction } from "@/utils/transaction";
import { CreateMemberDto } from "@/utils/user";
import { revalidatePath } from "next/cache";

export async function createMember(
    user: CreateMemberDto,
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

    console.log(res);

    if (!res.ok) {
        throw new Error(
            `Failed to create user: ${res.status} ${res.statusText}`
        );
    }

    revalidatePath(
        `${process.env.APINEXT_PUBLIC_API_URL_URL}/splits/${splitUrl}/users`
    );

    return res.json();
}
