import { Context, createContext } from "react";
import UserState from "./UserState";

const UserContext: Context<UserState | null> = createContext<UserState | null>(
    null
);

export default UserContext;
