export abstract class HttpService {
    private static api_url = process.env.NEXT_PUBLIC_API_URL;

    static async GET(
        route: string,
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request("GET", route, undefined, cachingBehaviour);
    }

    static async POST(
        route: string,
        body?: any,
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request("POST", route, body, cachingBehaviour);
    }

    static async PUT(
        route: string,
        body?: any,
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request("PUT", route, body, cachingBehaviour);
    }

    static async DELETE(route: string, body?: any): Promise<any> {
        return await this.request("DELETE", route, body);
    }

    private static async request(
        method: string,
        route: string,
        body?: any,
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        console.log(
            "Request to url: " +
                this.api_url +
                route +
                " with body: " +
                JSON.stringify(body)
        );

        return fetch(this.api_url + route, {
            method: method,
            headers: {
                charset: "UTF-8",
            },
            cache: cachingBehaviour,
            body: JSON.stringify(body),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log("Response: " + JSON.stringify(data));
                return data;
            });
    }
}
