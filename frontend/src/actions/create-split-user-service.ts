"use server";

import { CreateMemberDto, SerializedUser } from "@/utils/user";
import { revalidatePath } from "next/cache";

export async function createMember(
    user: CreateMemberDto,
    splitId: string
): Promise<SerializedUser> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/members`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/members`
    );

    return res.json();
}
