import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client: Client | null = null;
let isActive = false;
const subscriptions: Record<string, (msg: IMessage) => void> = {};
const subscriptionObjects: Record<string, StompSubscription> = {};
let isConnected = false;
const pendingSubscriptions: Array<{
    topic: string;
    callback: (msg: IMessage) => void;
}> = [];

export function getStompClient() {
    if (!client) {
        client = new Client({
            webSocketFactory: () =>
                new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`),
            onConnect: () => {
                isConnected = true;
                pendingSubscriptions.forEach(({ topic, callback }) => {
                    subscriptionObjects[topic] = client!.subscribe(
                        topic,
                        callback
                    );
                });
                pendingSubscriptions.length = 0;
            },
        });
    }
    if (!isActive) {
        client.activate();
        isActive = true;
    }
    return client;
}

export function subscribeToTopic(
    topic: string,
    callback: (msg: IMessage) => void
) {
    const client = getStompClient();
    subscriptions[topic] = callback;
    if (isConnected) {
        subscriptionObjects[topic] = client.subscribe(topic, callback);
        return subscriptionObjects[topic];
    } else {
        pendingSubscriptions.push({ topic, callback });
        return {
            unsubscribe: () => {
                delete subscriptions[topic];
            },
        } as StompSubscription;
    }
}

export function unsubscribeFromTopic(
    subscription: { unsubscribe: () => void },
    topic: string
) {
    if (subscriptionObjects[topic]) {
        subscriptionObjects[topic].unsubscribe();
        delete subscriptionObjects[topic];
    }
    delete subscriptions[topic];
}
