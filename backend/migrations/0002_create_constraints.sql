ALTER TABLE users
ADD
    CONSTRAINT activities_users_fkey FOREIGN KEY (activity_id) REFERENCES activities (id);

ALTER TABLE balances
ADD
    CONSTRAINT balances_users_fkey FOREIGN KEY (user_name, activity_id) REFERENCES users (name, activity_id),
ADD
    CONSTRAINT balances_expenses_fkey FOREIGN KEY (expense_id) REFERENCES expenses (id),
ADD
    CONSTRAINT balances_activities_fkey FOREIGN KEY (activity_id) REFERENCES activities (id);

ALTER TABLE expenses
ADD
    CONSTRAINT expenses_activities_fkey FOREIGN KEY (activity_id) REFERENCES activities (id),
ADD
    CONSTRAINT expenses_users_fkey FOREIGN KEY (user_name, activity_id) REFERENCES users (name, activity_id);