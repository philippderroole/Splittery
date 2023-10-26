type Activity = {
    id: string;
};

type Balance = {
    user: User;
    selected: boolean;
    share: number;
    amount: number;
};

type Expense = {
    activity: Activity;
    title: string;
    amount: number;
    user: User;
    balance: Balance[];
};

type User = {
    activity: Activity;
    name: string;
};
