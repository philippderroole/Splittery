import { Money } from "./money";

export interface Entry {
    id: string;
    name: string;
    amount: Money;
    tagIds: string[];
}

export interface SerializedEntry {
    id: string;
    name: string;
    amount: number;
    tagIds: string[];
}

export interface CreateEntryDto {
    name: string;
    amount: number | null;
    tagIds: string[];
}

export interface EditEntityDto {
    id: string;
    name: string;
    amount: number | null;
    tagIds: string[];
}
