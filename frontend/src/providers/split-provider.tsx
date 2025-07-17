"use client";
import { useSplitSocket } from "@/hooks/useSplitSocket"; // Your real-time hook
import { Split } from "@/utils/split";
import React, { useContext, useState } from "react";

const SplitContext = React.createContext<Split>({} as Split);

export interface SplitProviderProps {
    split: Split;
    children: React.ReactNode;
}

export function SplitProvider({
    split: initialSplit,
    children,
}: SplitProviderProps) {
    const [splitState, setSplitState] = useState<Split>(initialSplit);

    useSplitSocket(
        initialSplit.id,
        ["SplitChanged", "SplitDeleted"],
        (payload: unknown) => {
            setSplitState(payload as Split);
        }
    );

    return (
        <SplitContext.Provider value={splitState}>
            {children}
        </SplitContext.Provider>
    );
}

export function useSplit() {
    return useContext(SplitContext);
}
