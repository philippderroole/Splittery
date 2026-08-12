import React, { createContext, useContext } from "react";
import { Split } from "../utils/split";
import { useSplits } from "./splits-provider";

const SplitContext = createContext({
    split: {} as Split,
});

export interface SplitProviderProps {
    splitId: string;
    children: React.ReactNode;
}

export function SplitProvider({ splitId, children }: SplitProviderProps) {
    const { splits } = useSplits();

    const split = splits.find((s) => s.id === splitId);

    if (!split) {
        throw new Error(`Split with id ${splitId} not found`);
    }

    const value = { split };

    return (
        <SplitContext.Provider value={value}>{children}</SplitContext.Provider>
    );
}

export function useSplit() {
    return useContext(SplitContext);
}
