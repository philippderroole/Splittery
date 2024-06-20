export abstract class CurrencyFormat {
    static format(amount: number): string {
        return amount.toFixed(2) + "€";
    }

    static round(amount: number, decimals: number): number {
        return (
            Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals)
        );
    }
}
