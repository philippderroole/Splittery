import { Tag } from "./tag";

export interface User {
    id: string;
    username: string;
}

export interface SplitUser {
    id: string;
    name: string;
    avatarUri: string;
    saldo: number;
    type: "Guest" | "Registered";
}

export interface CreateMemberDto {
    name: string;
}

export interface CreateUserDto {
    username: string;
    email: string;
}

export interface SerializedUser {
    id: string;
    username: string;
}

export interface MemberWithTags extends SplitUser {
    tags: Tag[];
}
