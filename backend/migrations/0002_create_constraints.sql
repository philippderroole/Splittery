ALTER TABLE balances
ADD
    CONSTRAINT balances_users_fkey FOREIGN KEY (user_id) REFERENCES users (id),
ADD
    CONSTRAINT balances_expenses_fkey FOREIGN KEY (expense_id) REFERENCES expenses (id);

ALTER TABLE expenses
ADD
    CONSTRAINT expenses_activities_fkey FOREIGN KEY (activity_id) REFERENCES activities (id),
ADD
    CONSTRAINT expenses_users_fkey FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE users_activities
ADD
    CONSTRAINT users_activities_users_fkey FOREIGN KEY (user_id) REFERENCES users (id),
ADD
    CONSTRAINT users_activities_activities_fkey FOREIGN KEY (activity_id) REFERENCES activities (id);