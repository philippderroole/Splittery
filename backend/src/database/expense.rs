use std::error::Error;

use sqlx::Row;
use tide::Request;

use crate::{
    database::create_id,
    entities::{Expense, Metadata},
};

use super::{balance::get_balances_by_expense_id, user::get_user_by_id};

pub async fn create_unique_expense_id(request: &Request<sqlx::PgPool>) -> String {
    let query = "SELECT * FROM expenses WHERE id = $1";

    loop {
        let id = create_id(63);

        let row = sqlx::query(query)
            .bind(&id)
            .fetch_optional(request.state())
            .await
            .expect("failed to get expense");

        if row.is_none() {
            return id;
        }

        println!("id already exists, trying again")
    }
}

pub async fn get_expense_by_id(
    id: &String,
    pool: &sqlx::PgPool,
) -> Result<Expense, Box<dyn Error>> {
    let query = "SELECT * FROM expenses WHERE id = $1";

    let row = sqlx::query(query)
        .bind(&id)
        .fetch_one(pool)
        .await
        .expect("failed to get expense");

    let user = get_user_by_id(&row.get("user_id"), pool).await?;

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    let balances = get_balances_by_expense_id(&row.get("id"), pool).await?;

    Ok(Expense {
        metadata: metadata,
        id: row.get("id"),
        name: row.get("name"),
        amount: row.get("amount"),
        user_id: todo!(),
        balance_ids: todo!(),
    })
}

pub async fn get_expenses_by_activity_id(
    id: &String,
    request: &Request<sqlx::PgPool>,
) -> Vec<Expense> {
    let query = "SELECT * FROM expenses WHERE activity_id = $1";

    let rows = sqlx::query(query)
        .bind(&id)
        .fetch_all(request.state())
        .await
        .expect("failed to get expenses");

    let mut expenses = Vec::new();

    for row in rows {
        let expense = get_expense_by_id(&row.get("id"), request).await.unwrap();
        expenses.push(expense);
    }

    expenses
}

pub async fn get_expense_ids_by_activity_id(
    activity_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Result<Vec<String>, Box<dyn Error>> {
    let query = "SELECT id FROM expenses WHERE activity_id = $1";

    let rows = sqlx::query(query)
        .bind(&activity_id)
        .fetch_all(request.state())
        .await;

    let rows = match rows {
        Ok(rows) => rows,
        Err(err) => return Err(format!("Failed to get expense ids: {}", err).into()),
    };

    let mut ids = Vec::new();

    for row in rows {
        ids.push(row.get("id"));
    }

    Ok(ids)
}

pub async fn insert_expense(
    expense: &Expense,
    request: &sqlx::PgPool,
) -> Result<(), Box<dyn Error>> {
    let query = "INSERT INTO expenses (id, name, amount, user_id) VALUES ($1, $2, $3, $4, $5)";

    let _ = sqlx::query(query)
        .bind(&expense.id)
        .bind(&expense.name)
        .bind(&expense.amount)
        .bind(&expense.user_id)
        .execute(request.state())
        .await?;

    Ok(())
}

pub async fn update_expense(
    expense: &Expense,
    request: &Request<sqlx::PgPool>,
) -> Result<(), Box<dyn Error>> {
    let query = "UPDATE expenses SET name = $1, amount = $2, user_id = $3 WHERE id = $4";

    let _ = sqlx::query(query)
        .bind(&expense.name)
        .bind(&expense.amount)
        .bind(&expense.user_id)
        .bind(&expense.id)
        .execute(request.state())
        .await
        .expect("msg");

    Ok(())
}
