import { CreateSplitDto, Split } from "@/utils/split";

export async function getSplits(): Promise<Split[]> {
    return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`, {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json());
}

export async function getSplit(splitId: string): Promise<Split> {
    return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}`, {
        method: "GET",
        credentials: "include",
    })
        .then((response) => response.json());
}

export async function trackSplitVisit(splitId: string): Promise<void> {
    await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/visits`, {
        method: "POST",
        credentials: "include",
    });
}

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await fetch(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(split),
    }).then((response) => response.json());
}