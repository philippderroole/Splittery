export interface Split {
    id: string;
    name: string;
    url: string;
    users: UserBalance[];
}

export interface UserBalance {
    id: string;
    username: string;
    balance: number;
}
