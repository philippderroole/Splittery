import { GET } from "@/utils/request";
import { SerializedMember } from "@/utils/user";

export async function getMembers(splitId: string): Promise<SerializedMember[]> {
    return await GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/members`);
}
