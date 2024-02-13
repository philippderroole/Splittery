"use server";

import { revalidateTag as revalidate } from "next/cache";

export async function revalidateTag(tag: string) {
    revalidate(tag);
}
