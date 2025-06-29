import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { subscribeToTopic, unsubscribeFromTopic } from "@/utils/stompClient";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import { useEffect, useRef } from "react";

export function useTransactionsSocket(
    splitUrl: string,
    onUpdate: (transactions: Transaction[]) => void
) {
    const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

    useEffect(() => {
        const topic = `/topic/splits/${splitUrl}/transactions`;
        subscriptionRef.current = subscribeToTopic(topic, (message) => {
            const transactions: SerializedTransaction[] = JSON.parse(
                message.body
            );

            onUpdate(
                transactions.map((transaction) => ({
                    ...transaction,
                    date: new Date(transaction.date),
                    amount: new Money(transaction.amount, Currencies.EUR),
                    items: transaction.items.map((item) => ({
                        ...item,
                        amount: new Money(item.amount, Currencies.EUR),
                    })),
                }))
            );
        });

        return () => {
            if (subscriptionRef.current) {
                unsubscribeFromTopic(subscriptionRef.current, topic);
            }
        };
    }, [splitUrl, onUpdate]);
}
