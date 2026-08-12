import React, { createContext, useContext, useState } from "react";
import { Split } from "../utils/split";

const SplitContext = createContext({
    splits: [] as Split[],
});

export interface SplitsProviderProps {
    children: React.ReactNode;
}

export function SplitsProvider({ children }: SplitsProviderProps) {
    const [splits, _setSplits] = useState<Split[]>([]);

    const value = { splits };

    return (
        <SplitContext.Provider value={value}>{children}</SplitContext.Provider>
    );
}

export function useSplits() {
    return useContext(SplitContext);
}
