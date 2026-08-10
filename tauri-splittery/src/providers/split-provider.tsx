import React, { useContext, useState } from "react";
import { useSplitSocket } from "../hooks/useSplitSocket";
import { Split } from "../utils/split";

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
        },
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
