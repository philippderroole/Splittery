import React, { useContext, useState } from "react";
import { Tag } from "../utils/tag";

const TagsContext = React.createContext<Tag[]>([]);

export interface TagsProviderProps {
    tags: Tag[];
    children: React.ReactNode;
}

export function TagsProvider({
    tags: initialTags,
    children,
}: TagsProviderProps) {
    const [tagsState, _setTagsState] = useState<Tag[]>(initialTags);

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
