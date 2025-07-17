"use client";
import { useSplitSocket } from "@/hooks/useSplitSocket"; // Your real-time hook
import { MemberWithTags } from "@/utils/user";
import React, { useContext, useState } from "react";
import { useSplit } from "./split-provider";

const SplitUserContext = React.createContext<MemberWithTags[]>(
    [] as MemberWithTags[]
);

export interface SplitProviderProps {
    splitUsers: MemberWithTags[];
    children: React.ReactNode;
}

export function SplitUserProvider({
    splitUsers: initialSplitUsers,
    children,
}: SplitProviderProps) {
    const [splitUsers, setSplitUsers] =
        useState<MemberWithTags[]>(initialSplitUsers);

    const split = useSplit();

    useSplitSocket(
        split.id,
        ["SplitChanged", "SplitDeleted"],
        (payload: unknown) => {
            setSplitUsers(payload as MemberWithTags[]);
        }
    );

    return (
        <SplitUserContext.Provider value={splitUsers}>
            {children}
        </SplitUserContext.Provider>
    );
}

export function useSplitUsers() {
    return useContext(SplitUserContext);
}
