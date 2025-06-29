"use server";

import { Split } from "@/utils/split";

export async function createSplit(): Promise<Split> {
    return await fetch(`${process.env.API_URL}/splits`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    }).then((res) => {
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to create split");
        }

        return res.json();
    });
}
