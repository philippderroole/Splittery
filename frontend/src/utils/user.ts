export interface User {
    id: string;
    username: string;
}

export interface SplitUser {
    name: string;
    avatarUri: string;
    saldo: number;
    type: "Guest" | "Registered";
}

export interface CreateMemberDto {
    username: string;
}

export interface CreateUserDto {
    username: string;
    email: string;
}

export interface SerializedUser {
    id: string;
    username: string;
}
