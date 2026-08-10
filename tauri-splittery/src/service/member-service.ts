import { GET } from "../utils/request";
import { SerializedMember } from "../utils/user";

export async function getMembers(splitId: string): Promise<SerializedMember[]> {
    const apiUrl = import.meta.env.VITE_API_URL;

    return await GET(`${apiUrl}/splits/${splitId}/members`);
}
