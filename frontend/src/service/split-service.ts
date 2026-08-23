import { CreateSplitDto, Split } from "@/utils/split";
import { GET, POST } from "@/utils/request";

export async function getSplits(): Promise<Split[]> {
  return GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`);
}

export async function getSplit(splitId: string): Promise<Split> {
  return GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}`);
}

export async function trackSplitVisit(splitId: string): Promise<void> {
  await POST(
    `${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/visits`,
  );
}

export async function createSplit(split: CreateSplitDto): Promise<Split> {
  return POST(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`, {
    body: JSON.stringify(split),
  });
}
