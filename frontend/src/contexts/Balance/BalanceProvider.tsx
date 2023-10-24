import Balance from "@/interfaces/Balance";
import { useState } from "react";
import BalanceContext from "./BalanceContext";

const BalanceProvider = ({ children }) => {
    const [balances, setBalances] = useState<Balance[]>([]);

    return (
        <BalanceContext.Provider value={{ balances, setBalances }}>
            {children}
        </BalanceContext.Provider>
    );
};

export default BalanceProvider;
