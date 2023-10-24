use std::error::Error;

use sqlx::Row;

use crate::Expense;

pub async fn create_expense(expense: &Expense, pool: &sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "INSERT INTO expenses (name, amount, description) VALUES ($1, $2, $3)";

    sqlx::query(query)
        .bind(&expense.name)
        .bind(expense.amount)
        .bind(&expense.description)
        .execute(pool)
        .await?;

    Ok(())
}

pub async fn update_expense(
    expense: &Expense,
    pool: &sqlx::PgPool,
) -> Result<Expense, Box<dyn Error>> {
    let query = "UPDATE expenses SET amount = $1, description = $2 WHERE name = $3";

    let row = sqlx::query(query)
        .bind(expense.amount)
        .bind(&expense.description)
        .bind(&expense.name)
        .fetch_one(pool)
        .await?;

    let expense = Expense {
        name: row.get("name"),
        amount: row.get("amount"),
        description: row.get("description"),
        balance: todo!(),
    };

    Ok(expense)
}

pub async fn delete_expense(name: &str, pool: &sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "DELETE FROM expenses WHERE name = $1";

    sqlx::query(query).bind(name).execute(pool).await?;

    Ok(())
}

pub async fn get_all_expenses(
    name: &str,
    pool: &sqlx::PgPool,
) -> Result<Vec<Expense>, Box<dyn Error>> {
    let query = "SELECT * FROM expenses WHERE name = $1";

    let rows = sqlx::query(query).bind(name).fetch_all(pool).await?;
    let expenses = rows
        .iter()
        .map(|row| Expense {
            name: row.get("name"),
            amount: row.get("amount"),
            description: row.get("description"),
            balance: None,
        })
        .collect::<Vec<Expense>>();

    Ok(expenses)
}
