"use client";
import { useSplitSocket } from "@/hooks/useSplitSocket"; // Your real-time hook
import { SplitUser } from "@/utils/user";
import React, { useContext, useState } from "react";
import { useSplit } from "./split-provider";

const SplitUserContext = React.createContext<SplitUser[]>([] as SplitUser[]);

export interface SplitProviderProps {
    splitUsers: SplitUser[];
    children: React.ReactNode;
}

export function SplitUserProvider({
    splitUsers: initialSplitUsers,
    children,
}: SplitProviderProps) {
    const [splitUsers, setSplitUsers] =
        useState<SplitUser[]>(initialSplitUsers);

    const split = useSplit();

    useSplitSocket(
        split.id,
        ["SplitChanged", "SplitDeleted"],
        (payload: unknown) => {
            setSplitUsers(payload as SplitUser[]);
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
