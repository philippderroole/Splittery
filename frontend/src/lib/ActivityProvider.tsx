"use client";

import { createContext } from "react";

export class ActivityState {
    activity: Activity;
    users: User[];

    addUser(user: User) {
        this.users.push(user);
    }
}

export const ActivityContext = createContext({} as ActivityState);

export default function ActivityProvider({ activity_state, children }) {
    return (
        <ActivityContext.Provider value={activity_state}>
            {children}
        </ActivityContext.Provider>
    );
}
