import User from "./User";

export default interface Expense {
    title: string;
    amount: number;
    user: User;
}
