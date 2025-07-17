"use server";

export async function deleteTag(splitId: string, tagId: string): Promise<void> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/tags/${tagId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        console.error("Failed to create tag:", res.status, res.statusText);
        throw new Error(
            `Failed to create tag: ${res.status} ${res.statusText}`
        );
    }

    console.debug("Tag created successfully:", res.status, res.statusText);
}
