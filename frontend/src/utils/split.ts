import { User } from "./user";

export interface Split {
    id: string;
    name: string;
    url: string;
    users: User[];
}
