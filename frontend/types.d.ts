type Activity = {
    metadata: Metadata;
    id: string;
    user_ids: String[];
    expenses: Expense[];
};

type Balance = {
    metadata: Metadata;
    user: User;
    is_selected: boolean;
    share: number;
    amount: number;
};

type Expense = {
    metadata: Metadata;
    id: string;
    activity: Activity;
    name: string;
    amount: number;
    user: User;
    balances: Balance[];
};

type User = {
    metadata: Metadata;
    id: string;
    name: string;
    activity_ids: String[];
};

type Validity = {
    valid: boolean;
    message: string;
};

type Metadata = {
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
