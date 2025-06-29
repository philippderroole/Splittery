import { Split } from "@/utils/split";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

export function useSplitSocket(
    splitUrl: string,
    onUpdate: (split: Split) => void
) {
    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/split/${splitUrl}`, (message) => {
                    console.log(
                        "Received split update:",
                        JSON.parse(message.body)
                    );
                    onUpdate(JSON.parse(message.body));
                });
            },
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, [splitUrl, onUpdate]);
}
