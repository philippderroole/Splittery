"use server";

export async function registerAnonymous(): Promise<string> {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/anonymous`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    }).then((res) => {
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to create split");
        }

        return res.json();
    });
}
