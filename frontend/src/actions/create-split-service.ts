"use server";

import { CreateSplitDto, Split } from "@/utils/split";
import { revalidatePath } from "next/cache";

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/splits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(split),
    });

    if (!res.ok) {
        console.error(
            "Failed to create split:",
            res.status,
            res.statusText,
            await res.text()
        );
        throw new Error(
            `Failed to create split: ${res.status} ${res.statusText}`
        );
    }

    revalidatePath(`${process.env.NEXT_PUBLIC_API_URL}/splits`);

    return res.json();
}
