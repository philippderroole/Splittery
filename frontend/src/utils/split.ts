export interface Split {
    id: string;
    name: string;
    users: UserBalance[];
}

export interface CreateSplitDto {
    name: string;
}

export interface UserBalance {
    id: string;
    username: string;
    balance: number;
}
