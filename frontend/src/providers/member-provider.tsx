"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import { Member } from "@/utils/user";
import React, { createContext, useContext, useState } from "react";
import { useSplit } from "./split-provider";

const MemberContext = createContext<Member[]>([] as Member[]);

export interface MembersProviderProps {
    members: Member[];
    children: React.ReactNode;
}

export function MembersProvider({
    members: initalMembers,
    children,
}: MembersProviderProps) {
    const [members, setMembers] = useState<Member[]>(initalMembers);

    const split = useSplit();

    useSplitSocket(split.id, ["MemberCreated"], (payload: unknown) => {
        const memberPayload = payload as { member: Member };
        setMembers([...members, memberPayload.member]);
    });

    useSplitSocket(split.id, ["MemberEdited"], (payload: unknown) => {
        const memberPayload = payload as { member: Member };

        const oldMembers = members.filter(
            (m) => m.id !== memberPayload.member.id
        );

        setMembers([...oldMembers, memberPayload.member]);
    });

    return (
        <MemberContext.Provider value={members}>
            {children}
        </MemberContext.Provider>
    );
}

export function useMembers() {
    return useContext(MemberContext);
}
