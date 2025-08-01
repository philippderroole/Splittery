import "server-only";

import { GET } from "@/utils/request";
import { SerializedMember } from "@/utils/user";

export async function getMembers(splitId: string): Promise<SerializedMember[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members`
    );
}
