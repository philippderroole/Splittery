use std::error::Error;

use sqlx::Row;

async fn create_expense(expense: &Expense, pool: &sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "INSERT INTO expenses (name, amount, description) VALUES ($1, $2, $3)";

    sqlx::query(query)
        .bind(&expense.name)
        .bind(expense.amount)
        .bind(&expense.description)
        .execute(pool)
        .await?;

    Ok(())
}

async fn update_expense(expense: &Expense, pool: &sqlx::PgPool) -> Result<Expense, Box<dyn Error>> {
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
    };

    Ok(expense)
}

async fn delete_expense(name: &str, pool: &sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "DELETE FROM expenses WHERE name = $1";

    sqlx::query(query).bind(name).execute(pool).await?;

    Ok(())
}

async fn get_all_expenses(name: &str, pool: &sqlx::PgPool) -> Result<Vec<Expense>, Box<dyn Error>> {
    let query = "SELECT * FROM expenses WHERE name = $1";

    let rows = sqlx::query(query).bind(name).fetch_all(pool).await?;
    let expenses = rows
        .iter()
        .map(|row| Expense {
            name: row.get("name"),
            amount: row.get("amount"),
            description: row.get("description"),
        })
        .collect::<Vec<Expense>>();

    Ok(expenses)
}

struct Expense {
    name: String,
    amount: f64,
    description: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let url = dotenvy::var("DATABASE_URL")?;
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let expense = Expense {
        name: "Hello".to_string(),
        amount: 100.0,
        description: "Hello, world!".to_string(),
    };

    create_expense(&expense, &pool).await?;

    let expense = Expense {
        name: "Hello".to_string(),
        amount: 200.0,
        description: "Hello, world!".to_string(),
    };

    update_expense(&expense, &pool).await?;

    Ok(())
}
