import React, { createContext, useContext, useState } from "react";
import { deserializeMembers, Member, SerializedMember } from "../utils/user";
import { useSplit } from "./split-provider";

const MemberContext = createContext<Member[]>([] as Member[]);

export interface MembersProviderProps {
    serializedMembers: SerializedMember[];
    children: React.ReactNode;
}

export function MembersProvider({
    serializedMembers: initalSerializedMembers,
    children,
}: MembersProviderProps) {
    const initalMembers: Member[] = deserializeMembers(initalSerializedMembers);

    const [members, setMembers] = useState<Member[]>(initalMembers);

    const split = useSplit();

    return (
        <MemberContext.Provider value={members}>
            {children}
        </MemberContext.Provider>
    );
}

export function useMembers() {
    return useContext(MemberContext);
}
