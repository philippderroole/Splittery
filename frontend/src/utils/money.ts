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

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error("Cannot add money with different currencies");
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error("Cannot subtract money with different currencies");
        }
        return new Money(this.amount - other.amount, this.currency);
    }
}
