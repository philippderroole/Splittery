import { POST, PUT } from "../utils/request";
import {
    CreateMemberDto,
    EditMemberDto,
    SerializedMember,
} from "../utils/user";

const apiUrl = import.meta.env.VITE_API_URL;

export async function createMember(
    user: CreateMemberDto,
    splitId: string,
): Promise<SerializedMember> {
    return await POST(`${apiUrl}/splits/${splitId}/members`, {
        body: JSON.stringify(user),
    });
}

export async function editMember(
    splitId: string,
    memberId: string,
    member: EditMemberDto,
): Promise<SerializedMember> {
    return await PUT(`${apiUrl}/splits/${splitId}/members/${memberId}`, {
        body: JSON.stringify(member),
    });
}
