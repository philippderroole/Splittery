"use server";

import { POST } from "@/utils/request";
import { SerializedTransaction } from "@/utils/transaction";
import { CreateMemberDto } from "@/utils/user";

export async function createMember(
    user: CreateMemberDto,
    splitUrl: string
): Promise<SerializedTransaction> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitUrl}/users`,
        {
            body: JSON.stringify(user),
        }
    );
}
