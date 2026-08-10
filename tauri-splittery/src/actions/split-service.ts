import { POST } from "../utils/request";
import { CreateSplitDto, Split } from "../utils/split";

const apiUrl = import.meta.env.VITE_API_URL;

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await POST(`${apiUrl}/splits`, {
        body: JSON.stringify(split),
    });
}
