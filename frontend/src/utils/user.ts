export interface User {
    id: string;
    username: string;
}

export interface Member {
    id: string;
    name: string;
    avatarUri: string;
    saldo: number;
    type: "Guest" | "Registered";
    tagIds: string[];
}

export interface CreateMemberDto {
    name: string;
}

export interface EditMemberDto {
    name: string;
    tagIds: string[];
}

export interface CreateMemberWithTagsDto extends CreateMemberDto {
    tagIds: string[];
}

export interface CreateUserDto {
    username: string;
    email: string;
}

export interface SerializedUser {
    id: string;
    username: string;
}
