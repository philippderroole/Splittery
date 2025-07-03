import { Split } from "@/utils/split";
import { subscribeToTopic, unsubscribeFromTopic } from "@/utils/stompClient";
import { useEffect, useRef } from "react";

export function useSplitSocket(
    splitUrl: string,
    onUpdate: (split: Split) => void
) {
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    useEffect(() => {
        const topic = `/topic/splits/${splitUrl}`;
        subscriptionRef.current = subscribeToTopic(topic, (message) => {
            console.debug(
                `Received split update for ${splitUrl}:`,
                message.body
            );

            onUpdate(JSON.parse(message.body));
        });

        return () => {
            if (subscriptionRef.current) {
                unsubscribeFromTopic(subscriptionRef.current, topic);
            }
        };
    }, [splitUrl, onUpdate]);
}
