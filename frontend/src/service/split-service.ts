import "server-only";

export async function getSplit(splitId: string) {
    console.debug("Fetching split data for splitId:", splitId);
    console.debug(
        "URL:",
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}`
    );

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}`,
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
