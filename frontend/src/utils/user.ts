import { Currencies } from "./currencies";
import { Money } from "./money";

export interface User {
    id: string;
    username: string;
}

type MemberType = "Guest" | "Registered";

export interface SerializedMember {
    id: string;
    name: string;
    avatarUri: string;
    amountSpent: number;
    amountShare: number;
    type: MemberType;
    tagIds: string[];
}

export interface Member {
    id: string;
    name: string;
    avatarUri: string;
    amountSpent: Money;
    amountShare: Money;
    type: MemberType;
    tagIds: string[];
}

export function deserializeMember(serialized: SerializedMember): Member {
    return {
        ...serialized,
        amountSpent: new Money(serialized.amountSpent, Currencies.EUR),
        amountShare: new Money(serialized.amountShare, Currencies.EUR),
    };
}

export function deserializeMembers(serialized: SerializedMember[]): Member[] {
    return serialized.map((m) => {
        return deserializeMember(m);
    });
}

export interface CreateMemberDto {
    name: string;
    tagIds: string[];
}

export interface EditMemberDto {
    name: string;
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
