import User from "./User";

export default interface Balance {
    selected: boolean;
    share: number;
    user: User;
    amount: number;
}
