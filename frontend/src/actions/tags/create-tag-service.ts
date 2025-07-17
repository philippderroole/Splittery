"use server";

import { CreateTagDto, Tag } from "@/utils/tag";

export async function createTag(
    splitId: string,
    tag: CreateTagDto
): Promise<Tag> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/tags`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
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
