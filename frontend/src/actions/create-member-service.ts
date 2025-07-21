"use server";

import { POST } from "@/utils/request";
import { CreateMemberDto, SerializedUser } from "@/utils/user";

export async function createMember(
    user: CreateMemberDto,
    splitId: string
): Promise<SerializedUser> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/members`,
        {
            body: JSON.stringify(user),
        }
    );
}
