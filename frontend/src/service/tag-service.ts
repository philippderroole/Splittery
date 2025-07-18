import { Tag } from "@/utils/tag";
import { MemberWithTags } from "@/utils/user";
import "server-only";

export async function getTags(splitId: string): Promise<Tag[]> {
    console.debug(
        `Fetching tags from URL: ${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/tags`
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

    const tags = await res.json();

    console.debug("Fetched tags: ", tags);

    return tags;
}

export async function getMembersWithTags(
    splitId: string
): Promise<MemberWithTags[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/members/tags`,
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
