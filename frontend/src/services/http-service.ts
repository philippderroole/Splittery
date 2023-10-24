export abstract class HttpService {
    private static api_url = process.env.NEXT_PUBLIC_API_URL;

    public static GET(route: string): Promise<any> {
        return this.request("GET", route);
    }

    public static POST(route: string, body?: any): Promise<any> {
        return this.request("POST", route, body);
    }

    private static request(
        method: string,
        route: string,
        body?: any
    ): Promise<any> {
        console.log("Request to url: " + this.api_url + route);

        if (body != null) {
            console.log(body);
        }

        return fetch(this.api_url + route, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                charset: "UTF-8",
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) {
                    Promise.reject(response);
                }
                return response.json();
            })
            .catch((response) => console.log(response))
            .then((data) => {
                console.log(data);
                return data;
            });
    }
}
