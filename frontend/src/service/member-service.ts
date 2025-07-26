import "server-only";

import { GET } from "@/utils/request";

export async function getMembers(splitId: string) {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members`
    );
}
