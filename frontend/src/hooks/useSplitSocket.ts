import { MessageType, subscribeToMessages } from "@/utils/websocket";
import { useEffect, useRef } from "react";

export function useSplitSocket(
    splitId: string,
    types: MessageType[],
    onUpdate: (payload: unknown) => void
) {
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    useEffect(() => {
        subscriptionRef.current = subscribeToMessages(splitId, (message) => {
            console.debug(`Received split update for ${splitId}:`, message);

            if (types.includes(message.type)) {
                return;
            }

            onUpdate(message.payload);
        });
    }, [splitId, onUpdate, types]);
}
