import React, { createContext, useContext, useEffect, useState } from "react";
import { getSplits } from "../service/split-service";
import { Split } from "../utils/split";

const SplitContext = createContext({
    splits: [] as Split[],
});

export interface SplitsProviderProps {
    children: React.ReactNode;
}

export function SplitsProvider({ children }: SplitsProviderProps) {
    const [splits, setSplits] = useState<Split[]>([]);

    useEffect(() => {
        let isMounted = true;

        getSplits().then((fetchedSplits) => {
            if (isMounted) {
                setSplits(fetchedSplits);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const value = { splits };

    return (
        <SplitContext.Provider value={value}>{children}</SplitContext.Provider>
    );
}

export function useSplits() {
    return useContext(SplitContext);
}
