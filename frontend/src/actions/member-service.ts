"use server";

import { POST, PUT } from "@/utils/request";
import {
    CreateMemberWithTagsDto,
    EditMemberDto,
    SerializedUser,
} from "@/utils/user";

export async function createMember(
    user: CreateMemberWithTagsDto,
    splitId: string
): Promise<SerializedUser> {
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
): Promise<SerializedUser> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members/${memberId}`,
        {
            body: JSON.stringify(member),
        }
    );
}
