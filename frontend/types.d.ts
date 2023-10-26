type Activity = {
    id: string;
};

type Balance = {
    user: User;
    is_selected: boolean;
    share: number;
    amount: number;
};

type Expense = {
    id: string;
    activity: Activity;
    name: string;
    amount: number;
    user: User;
    balances: Balance[];
};

type User = {
    activity: Activity;
    name: string;
};

type Validity = {
    valid: boolean;
    message: string;
};
