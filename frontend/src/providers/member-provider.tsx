"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import {
    deserializeMember,
    deserializeMembers,
    Member,
    SerializedMember,
} from "@/utils/user";
import React, { createContext, useContext, useState } from "react";
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

    useSplitSocket(split.id, ["MemberCreated"], (payload: unknown) => {
        const memberPayload = payload as { member: SerializedMember };
        const member = deserializeMember(memberPayload.member);
        setMembers([...members, member]);
    });

    useSplitSocket(split.id, ["MemberUpdated"], (payload: unknown) => {
        const memberPayload = payload as { member: SerializedMember };
        const member = deserializeMember(memberPayload.member);

        const oldMembers = members.filter((m) => m.id !== member.id);

        setMembers([...oldMembers, member]);
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
