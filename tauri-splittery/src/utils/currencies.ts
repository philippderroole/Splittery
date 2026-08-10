import { Currency } from "./currency";

export const Currencies: { [code: string]: Currency } = {
    EUR: new Currency("Euro", "€", "EUR", 2, false, ",", "."),
    USD: {
        name: "US Dollar",
        symbol: "$",
        code: "USD",
        decimalDigits: 2,
        symbolFirst: true,
        decimalSeparator: ".",
        thousandsSeparator: ",",
    } as Currency,
};
