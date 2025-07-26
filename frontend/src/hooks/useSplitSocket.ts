import { MessageType, subscribeToMessages } from "@/utils/websocket";
import { useEffect, useRef } from "react";

export function useSplitSocket(
    splitId: string,
    types: MessageType[],
    onUpdate: (payload: unknown) => void
) {
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
    const onUpdateRef = useRef(onUpdate);
    const typesRef = useRef(types);

    // Keep refs updated with latest values
    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
        typesRef.current = types;
    }, [types]);

    useEffect(() => {
        // Clean up previous subscription
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = subscribeToMessages(splitId, (message) => {
            if (!typesRef.current.includes(message.type)) {
                return;
            }

            onUpdateRef.current(message.payload);
        });

        // Cleanup on unmount or splitId change
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [splitId]); // Only depend on splitId

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, []);
}
