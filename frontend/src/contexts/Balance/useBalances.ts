import { useContext } from "react";
import BalanceContext from "./BalanceContext";
import BalanceState from "./BalanceState";

const useBalances = (): BalanceState => {
    const context = useContext(BalanceContext);

    if (!context) {
        throw new Error("Please use BalanceProvider in a parent component");
    }

    return context;
};

export default useBalances;
