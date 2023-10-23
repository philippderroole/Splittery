import User from "./User";

export interface Balance {
    selected: boolean;
    share: number;
    user: User;
    amount: number;
}
