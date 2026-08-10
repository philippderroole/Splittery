import { GET } from "../utils/request";

export async function getSplit(splitId: string) {
    const apiUrl = import.meta.env.VITE_API_URL;

    return await GET(`${apiUrl}/splits/${splitId}`);
}
