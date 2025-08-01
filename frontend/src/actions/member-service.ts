"use server";

import { POST, PUT } from "@/utils/request";
import { CreateMemberDto, EditMemberDto, SerializedMember } from "@/utils/user";

export async function createMember(
    user: CreateMemberDto,
    splitId: string
): Promise<SerializedMember> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members`,
        {
            body: JSON.stringify(user),
        }
    );
}

export async function editMember(
    splitId: string,
    memberId: string,
    member: EditMemberDto
): Promise<SerializedMember> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members/${memberId}`,
        {
            body: JSON.stringify(member),
        }
    );
}
