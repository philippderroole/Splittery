import "server-only";

export async function getSplit(splitUrl: string) {
    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitUrl}`,
        {
            //cache: "force-cache",
        }
    ).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch transaction groups");
        }

        return res.json();
    });
}
