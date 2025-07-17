"use server";

import { CreateSplitDto, Split } from "@/utils/split";

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/splits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(split),
    }).then((res) => {
        if (!res.ok) {
            console.error(
                "Failed to create split:",
                res.status,
                res.statusText
            );
            throw new Error(
                `Failed to create split: ${res.status} ${res.statusText}`
            );
        }

        console.debug(
            "Split created successfully:",
            res.status,
            res.statusText
        );

        return res.json();
    });
}
