export type MessageType =
    | "SplitChanged"
    | "SplitDeleted"
    | "TagChanged"
    | "TagDeleted"
    | "TransactionChanged"
    | "TransactionDeleted"
    | "MemberCreated"
    | "MemberEdited";
export interface WebSocketMessage {
    type: MessageType;
    payload: unknown;
}

// Store connections per splitId
const connections: Map<string, WebSocketConnection> = new Map();

interface WebSocketConnection {
    socket: WebSocket;
    handlers: Map<string, (msg: WebSocketMessage) => void>;
    isConnecting: boolean;
}

export function connectWebSocket(splitId: string) {
    // Return existing connection if it exists and is open
    const existing = connections.get(splitId);
    if (existing && existing.socket.readyState === WebSocket.OPEN) {
        return existing.socket;
    }

    // Don't create multiple connections while one is connecting
    if (existing && existing.isConnecting) {
        return existing.socket;
    }

    const webSocketUrl = process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws");
    const socket = new WebSocket(`${webSocketUrl}/ws/splits/${splitId}`);

    const connection: WebSocketConnection = {
        socket,
        handlers: new Map(),
        isConnecting: true,
    };

    connections.set(splitId, connection);

    socket.onopen = () => {
        console.log(`WebSocket connected for split: ${splitId}`);
        connection.isConnecting = false;
    };

    socket.onmessage = (event) => {
        try {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log("Received message:", message);

            // Call all handlers for this split
            connection.handlers.forEach((handler) => {
                handler(message);
            });
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    };

    socket.onclose = () => {
        console.log(`WebSocket disconnected for split: ${splitId}`);
        connections.delete(splitId);
    };

    socket.onerror = (error) => {
        console.error(`WebSocket error for split ${splitId}:`, error);
        connection.isConnecting = false;
    };

    return socket;
}

export function subscribeToMessages(
    splitId: string,
    callback: (msg: WebSocketMessage) => void
) {
    // Generate unique handler ID
    const handlerId = `${Date.now()}-${Math.random()}`;

    // Connect to WebSocket (or get existing connection)
    connectWebSocket(splitId);

    // Add handler to the connection
    const connection = connections.get(splitId);
    if (connection) {
        connection.handlers.set(handlerId, callback);
    }

    return {
        unsubscribe: () => {
            const connection = connections.get(splitId);
            if (connection) {
                connection.handlers.delete(handlerId);

                // If no more handlers, close the connection
                if (connection.handlers.size === 0) {
                    connection.socket.close();
                    connections.delete(splitId);
                }
            }
        },
    };
}

export function disconnectWebSocket(splitId?: string) {
    if (splitId) {
        // Disconnect specific split
        const connection = connections.get(splitId);
        if (connection) {
            connection.socket.close();
            connections.delete(splitId);
        }
    } else {
        // Disconnect all
        connections.forEach((connection) => {
            connection.socket.close();
        });
        connections.clear();
    }
}

// Get connection status for debugging
export function getConnectionStatus(splitId: string) {
    const connection = connections.get(splitId);
    return {
        exists: !!connection,
        readyState: connection?.socket.readyState,
        handlersCount: connection?.handlers.size || 0,
        isConnecting: connection?.isConnecting || false,
    };
}
