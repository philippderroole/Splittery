// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function parseResponseBody<T>(res: Response): Promise<T | null> {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

let isRedirectingToLogin = false;
let refreshInFlight: Promise<boolean> | null = null;

const API_BASE_URL = import.meta.env.VITE_INTERNAL_API_URL;

function isRefreshEndpoint(url: string): boolean {
  return url.endsWith("/auth/refresh");
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

async function fetchWithRevalidation(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401 || isRefreshEndpoint(url)) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return response;
  }

  return fetch(url, {
    ...init,
    credentials: "include",
  });
}

function redirectToLoginOnUnauthorized(res: Response): void {
  if (
    res.status === 401 &&
    window.location.pathname !== "/" &&
    !isRedirectingToLogin
  ) {
    isRedirectingToLogin = true;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/?returnTo=${encodeURIComponent(returnTo)}`);
  }
}

export async function GET(url: string, init?: RequestInit): Promise<any> {
  console.debug("Getting data from:", url);

  const res = await fetchWithRevalidation(url, {
    ...init,
    method: "GET",
    body: undefined,
  });

  if (!res.ok) {
    redirectToLoginOnUnauthorized(res);
    console.error(
      "Failed fetching data:",
      res.status,
      res.statusText,
      await res.text(),
    );

    throw new Error("Failed to fetch data");
  }

  const json = await parseResponseBody(res);

  console.debug("Fetched data: ", json);

  return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(url: string, init?: RequestInit): Promise<any> {
  console.debug("Posting data to:", url, init?.body);

  const res = await fetchWithRevalidation(url, {
    ...init,
    method: "POST",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    redirectToLoginOnUnauthorized(res);
    console.error(
      "Failed posting data:",
      res.status,
      res.statusText,
      await res.text(),
    );

    throw new Error("Failed to post data");
  }

  const json = await parseResponseBody(res);

  console.debug("Received response: ", json);

  return json;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(url: string, init?: RequestInit): Promise<any> {
  console.debug("Putting data to:", url, init?.body);

  const res = await fetchWithRevalidation(url, {
    ...init,
    method: "PUT",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    redirectToLoginOnUnauthorized(res);
    console.error(
      "Failed putting data:",
      res.status,
      res.statusText,
      await res.text(),
    );

    throw new Error("Failed to put data");
  }

  const json = await parseResponseBody(res);

  console.debug("Received response: ", json);

  return json;
}

export async function DELETE(url: string, init?: RequestInit): Promise<void> {
  console.debug("Deleting data from:", url);

  const res = await fetchWithRevalidation(url, {
    ...init,
    method: "DELETE",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    redirectToLoginOnUnauthorized(res);
    console.error(
      "Failed deleting data:",
      res.status,
      res.statusText,
      await res.text(),
    );

    throw new Error("Failed to delete data");
  }

  console.debug("Data deleted successfully");
}
