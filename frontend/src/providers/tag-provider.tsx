"use client";
import { useSplitSocket } from "@/hooks/useSplitSocket";
import { Tag } from "@/utils/tag";
import React, { useContext, useState } from "react";

const TagsContext = React.createContext<Tag[]>([]);

export interface TagsProviderProps {
    tags: Tag[];
    children: React.ReactNode;
}

export function TagsProvider({
    tags: initialTags,
    children,
}: TagsProviderProps) {
    const [tagsState, setTagsState] = useState<Tag[]>(initialTags);

    useSplitSocket(
        "splitId", // Replace with the actual split ID or context if needed
        ["TagChanged", "TagDeleted"],
        (payload: unknown) => {
            setTagsState(payload as Tag[]);
        }
    );

    return (
        <TagsContext.Provider value={tagsState}>
            {children}
        </TagsContext.Provider>
    );
}

export function useTags() {
    const context = useContext(TagsContext);

    if (!context) {
        throw new Error("useTags must be used within a TagsProvider");
    }
    return context;
}
