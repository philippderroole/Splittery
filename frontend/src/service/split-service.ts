import "server-only";

export async function getSplit(splitId: string) {
    console.debug(
        `Fetching split from URL: ${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}`
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

    const split = await res.json();

    console.debug("Fetched split: ", split);

    return split;
}
