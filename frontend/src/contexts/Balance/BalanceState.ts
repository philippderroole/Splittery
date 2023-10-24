import Balance from "@/interfaces/Balance";

type BalanceState = {
    balances: Balance[];
    setBalances(balances: Balance[]): void;
};

export default BalanceState;
