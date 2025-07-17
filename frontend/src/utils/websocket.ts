export type MessageType =
    | "SplitChanged"
    | "SplitDeleted"
    | "TagChanged"
    | "TagDeleted"
    | "TransactionChanged"
    | "TransactionDeleted";

export interface WebSocketMessage {
    type: MessageType;
    payload: unknown;
}

let socket: WebSocket | null = null;
const messageHandlers: Record<string, (msg: WebSocketMessage) => void> = {};

export function connectWebSocket(splitId: string) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    const webSocketUrl = process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws");
    socket = new WebSocket(`${webSocketUrl}/ws/splits/${splitId}`);

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log("Received message:", message);

            // Call all registered handlers
            Object.values(messageHandlers).forEach((handler) => {
                handler(message);
            });
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        socket = null;
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    return socket;
}

export function subscribeToMessages(
    splitId: string,
    callback: (msg: WebSocketMessage) => void
) {
    const handlerId = Date.now().toString();
    messageHandlers[handlerId] = callback;

    connectWebSocket(splitId);

    return {
        unsubscribe: () => {
            delete messageHandlers[handlerId];
        },
    };
}

export function disconnectWebSocket() {
    if (socket) {
        socket.close();
        socket = null;
    }
}
