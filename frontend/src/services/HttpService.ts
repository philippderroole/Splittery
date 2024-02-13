export abstract class HttpService {
    private static api_url = process.env.NEXT_PUBLIC_API_URL;

    static async GET(
        route: string,
        tags?: string[],
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request(
            "GET",
            route,
            undefined,
            tags,
            cachingBehaviour
        );
    }

    static async POST(
        route: string,
        body?: any,
        tags?: string[],
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request("POST", route, body, tags, cachingBehaviour);
    }

    static async PUT(
        route: string,
        body?: any,
        tags?: string[],
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        return await this.request("PUT", route, body, tags, cachingBehaviour);
    }

    static async DELETE(route: string, body?: any): Promise<any> {
        return await this.request("DELETE", route, body);
    }

    private static async request(
        method: string,
        route: string,
        body?: any,
        tags?: string[],
        cachingBehaviour?: RequestCache
    ): Promise<any> {
        console.log(
            method +
                " request to url: " +
                this.api_url +
                route +
                " with body: " +
                JSON.stringify(body)
        );

        return fetch(this.api_url + route, {
            method: method,
            headers: {
                charset: "UTF-8",
                "Content-Type": "application/json",
            },
            cache: cachingBehaviour ? cachingBehaviour : "default",
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
