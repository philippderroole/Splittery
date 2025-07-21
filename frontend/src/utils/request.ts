import { revalidatePath } from "next/cache";

export async function GET(url: string, init?: RequestInit): Promise<any> {
    console.debug("Getting data from:", url);

    const res = await fetch(url, {
        ...init,
        method: "GET",
        body: undefined,
    });

    if (!res.ok) {
        console.error(
            "Failed fetching data:",
            res.status,
            res.statusText,
            await res.text()
        );

        throw new Error("Failed to fetch data");
    }

    const json = await res.json();

    console.debug("Fetched data: ", json);

    return json;
}

export async function POST(url: string, init?: RequestInit): Promise<any> {
    console.debug("Posting data to:", url);

    const res = await fetch(url, {
        ...init,
        method: "POST",
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        console.error(
            "Failed posting data:",
            res.status,
            res.statusText,
            await res.text()
        );

        throw new Error("Failed to post data");
    }

    const json = await res.json();

    console.debug("Received response: ", json);

    revalidatePath(url);

    return json;
}

export async function PUT(url: string, init?: RequestInit): Promise<any> {
    console.debug("Putting data to:", url);

    const res = await fetch(url, {
        ...init,
        method: "PUT",
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        console.error(
            "Failed putting data:",
            res.status,
            res.statusText,
            await res.text()
        );

        throw new Error("Failed to put data");
    }

    const json = await res.json();

    console.debug("Received response: ", json);

    revalidatePath(url);

    return json;
}

export async function DELETE(url: string, init?: RequestInit): Promise<void> {
    console.debug("Deleting data from:", url);

    const res = await fetch(url, {
        ...init,
        method: "DELETE",
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        console.error(
            "Failed deleting data:",
            res.status,
            res.statusText,
            await res.text()
        );

        throw new Error("Failed to delete data");
    }

    revalidatePath(url);

    console.debug("Data deleted successfully");
}
