import { Currency } from "./currency";

export class Money {
    private amount: number;
    private currency: Currency;

    constructor(amount: number, currency: Currency) {
        this.amount = amount;
        this.currency = currency;
    }

    getAmount() {
        return this.amount;
    }

    getCurrency() {
        return this.currency;
    }

    toString() {
        return this.currency.format(this.amount);
    }
}
