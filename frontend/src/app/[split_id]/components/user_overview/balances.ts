export function getTotalAmountSpent(transactions) {
    return transactions.reduce(
        (acc, transaction) => acc - transaction.amount,
        0
    );
}

export function getAmountSpent(transactions, user_id: number) {
    return transactions
        .filter((transaction) => transaction.user_id === user_id)
        .filter((transaction) => transaction.amount < 0)
        .reduce((acc, transaction) => acc - transaction.amount, 0);
}

export function getAmountReceived(transactions, user_id: number) {
    return transactions
        .filter((transaction) => transaction.user_id === user_id)
        .filter((transaction) => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
}

export function getAmountOutstanding(transactions, users, user_id: number) {
    const total = getTotalAmountSpent(transactions);
    const share_per_user = total / users.length;

    const spent = getAmountSpent(transactions, user_id);
    const received = getAmountReceived(transactions, user_id);
    const user_total = spent - received;

    if (spent < received) {
        return 0;
    }

    if (user_total < share_per_user) {
        return 0;
    }

    return user_total - share_per_user;
}

export function getAmountDue(transactions, users, user_id: number) {
    const total = getTotalAmountSpent(transactions);
    const share_per_user = total / users.length;

    const spent = getAmountSpent(transactions, user_id);
    const received = getAmountReceived(transactions, user_id);
    const user_total = received - spent;

    if (user_total + share_per_user < 0) {
        return 0;
    }

    return user_total + share_per_user;
}
