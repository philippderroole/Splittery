import "server-only";

import { GET } from "@/utils/request";
import { Tag } from "@/utils/tag";
import { MemberWithTags } from "@/utils/user";

export async function getTags(splitId: string): Promise<Tag[]> {
    return await GET(`${process.env.INTERNAL_API_URL}/splits/${splitId}/tags`);
}

export async function getMembersWithTags(
    splitId: string
): Promise<MemberWithTags[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members/tags`
    );
}
