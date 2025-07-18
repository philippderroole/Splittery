"use server";

import { Tag } from "@/utils/tag";

export async function addTagsToTransaction(
    splitId: string,
    transactionId: string,
    tags: Tag[]
): Promise<Tag> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}/tags`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tags),
        }
    );

    if (!res.ok) {
        console.error("Failed to create tag:", res.status, res.statusText);
        throw new Error(
            `Failed to create tag: ${res.status} ${res.statusText}`
        );
    }

    console.debug("Tag created successfully:", res.status, res.statusText);

    return res.json();
}
