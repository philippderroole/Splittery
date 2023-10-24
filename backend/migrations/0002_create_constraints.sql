ALTER TABLE users
ADD
    CONSTRAINT activity_user_fkey FOREIGN KEY (activity) REFERENCES activities (id);

ALTER TABLE balances
ADD
    CONSTRAINT balances_user_name_fkey FOREIGN KEY (user_name, activity) REFERENCES users (name, activity),
ADD
    CONSTRAINT balances_expense_fkey FOREIGN KEY (expense, activity) REFERENCES expenses (name, activity);

ALTER TABLE expenses
ADD
    CONSTRAINT expenses_activity_fkey FOREIGN KEY (activity) REFERENCES activities (id);