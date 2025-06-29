import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

export function useTransactionsSocket(
    splitUrl: string,
    onUpdate: (transactions: Transaction[]) => void
) {
    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(
                    `/topic/split/${splitUrl}/transactions`,
                    (message) => {
                        console.log(
                            "Received transaction update:",
                            JSON.parse(message.body)
                        );

                        const transactions: SerializedTransaction[] =
                            JSON.parse(message.body);

                        onUpdate(
                            transactions.map((transaction) => ({
                                ...transaction,
                                date: new Date(transaction.date),
                                amount: new Money(
                                    transaction.amount,
                                    Currencies.EUR
                                ),
                                items: transaction.items.map((item) => ({
                                    ...item,
                                    amount: new Money(
                                        item.amount,
                                        Currencies.EUR
                                    ),
                                })),
                            }))
                        );
                    }
                );
            },
        });
        client.activate();
        return () => {
            client.deactivate();
        };
    }, [splitUrl, onUpdate]);
}
