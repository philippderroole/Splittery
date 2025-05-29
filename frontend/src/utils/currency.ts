export class Currency {
    constructor(
        public name: string,
        public symbol: string,
        public code: string,
        public decimalDigits: number,
        public symbolFirst: boolean,
        public decimalSeparator: string,
        public thousandsSeparator: string
    ) {}

    format(value: number): string {
        const parts = value.toFixed(this.decimalDigits).split(".");
        parts[0] = parts[0].replace(
            /\B(?=(\d{3})+(?!\d))/g,
            this.thousandsSeparator
        );
        return this.symbolFirst
            ? `${this.symbol}${parts.join(this.decimalSeparator)}`
            : `${parts.join(this.decimalSeparator)}${this.symbol}`;
    }
}
