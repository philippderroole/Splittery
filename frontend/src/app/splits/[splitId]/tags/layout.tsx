import "server-only";

import { TagsProvider } from "@/providers/tag-provider";
import { getTags } from "@/service/tag-service";
import { notFound } from "next/navigation";

export default async function TagLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ splitId: string }>;
}) {
    const { splitId } = await params;

    let tags;

    try {
        tags = await getTags(splitId); // Replace with actual splitId
    } catch (error) {
        console.error("Failed to fetch tags:", error);
        return notFound();
    }

    return (
        <div>
            <TagsProvider tags={tags}>{children}</TagsProvider>
        </div>
    );
}
