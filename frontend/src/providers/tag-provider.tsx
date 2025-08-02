"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import { Tag } from "@/utils/tag";
import React, { useContext, useState } from "react";
import { useSplit } from "./split-provider";

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

    const split = useSplit();

    useSplitSocket(split.id, ["MemberCreated"], (payload: unknown) => {
        const memberPayload = payload as { tags: Tag[] };

        const newTags = memberPayload.tags.filter(
            (tag) => !tagsState.some((existingTag) => existingTag.id === tag.id)
        );

        setTagsState([...tagsState, ...newTags]);
    });

    useSplitSocket(split.id, ["MemberUpdated"], (payload: unknown) => {
        const memberPayload = payload as { tags: Tag[] };

        const oldTags = tagsState.filter(
            (tag) =>
                !memberPayload.tags.some((memberTag) => memberTag.id === tag.id)
        );

        setTagsState([...oldTags, ...memberPayload.tags]);
    });

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
