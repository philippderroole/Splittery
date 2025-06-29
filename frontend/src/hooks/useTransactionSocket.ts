import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

export function useTransactionSocket(
    splitUrl: string,
    transactionUrl: string,
    onUpdate: (transaction: Transaction) => void
) {
    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(
                    `/topic/split/${splitUrl}/transactions/${transactionUrl}`,
                    (message) => {
                        console.log(
                            "Received transaction update:",
                            JSON.parse(message.body)
                        );

                        const transaction: SerializedTransaction = JSON.parse(
                            message.body
                        );

                        onUpdate({
                            ...transaction,
                            date: new Date(transaction.date),
                            amount: new Money(
                                transaction.amount,
                                Currencies.EUR
                            ),
                            items: transaction.items.map((item) => ({
                                ...item,
                                amount: new Money(item.amount, Currencies.EUR),
                            })),
                        });
                    }
                );
            },
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, [splitUrl, transactionUrl, onUpdate]);
}
