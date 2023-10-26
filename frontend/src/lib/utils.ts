export default class Utils {
    static rountToDecimals(num: number, decimals: number): number {
        return (
            Math.round((num + Number.EPSILON) * 10 * decimals) / (10 * decimals)
        );
    }
}
