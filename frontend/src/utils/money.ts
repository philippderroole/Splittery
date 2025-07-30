import { Currency } from "./currency";

export class Money {
    private cents: number;
    private currency: Currency;

    constructor(amount: number, currency: Currency) {
        this.cents = amount;
        this.currency = currency;
    }

    getAmount() {
        return this.cents;
    }

    getCurrency() {
        return this.currency;
    }

    toString() {
        return this.currency.format(this.cents / 100);
    }

    add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error("Cannot add money with different currencies");
        }
        return new Money(this.cents + other.cents, this.currency);
    }

    subtract(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error("Cannot subtract money with different currencies");
        }
        return new Money(this.cents - other.cents, this.currency);
    }
}
