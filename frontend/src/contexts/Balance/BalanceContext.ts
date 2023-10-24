import { createContext } from "react";
import BalanceState from "./BalanceState";

const BalanceContext = createContext<BalanceState | null>(null);

export default BalanceContext;
