export abstract class CurrencyFormat {
    static format(amount: number): string {
        return amount.toFixed(2) + "€";
    }
}
