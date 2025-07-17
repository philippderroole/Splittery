import "server-only";

export async function getTags(splitId: string) {
    console.debug("Fetching tags data for splitId:", splitId);
    console.debug(
        "URL:",
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/tags`
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/tags`,
        {
            method: "GET",
            //cache: "force-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch split data");
    }

    return res.json();
}
