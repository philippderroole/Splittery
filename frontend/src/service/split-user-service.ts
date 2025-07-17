import "server-only";

export async function getMembers(splitId: string) {
    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/members`,
        {
            method: "GET",
            //cache: "force-cache",
        }
    ).then((res) => {
        if (!res.ok) {
            throw new Error("Failed to fetch members");
        }

        return res.json();
    });
}
