use std::error::Error;

use sqlx::Row;

use crate::{
    database::create_id,
    entities::{Expense, Metadata},
};

use super::{balance::get_balances_by_expense_id, user::get_user_by_id};

pub async fn create_unique_expense_id(pool: &sqlx::PgPool) -> String {
    let query = "SELECT * FROM expenses WHERE id = $1";

    loop {
        let id = create_id(63);

        let row = sqlx::query(query)
            .bind(&id)
            .fetch_optional(pool)
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
        metadata: Some(metadata),
        id: row.get("id"),
        name: row.get("name"),
        amount: row.get("amount"),
        user: Some(user),
        balances: Some(balances),
    })
}

pub async fn get_expenses_by_activity_id(id: &String, pool: &sqlx::PgPool) -> Vec<Expense> {
    let query = "SELECT * FROM expenses WHERE activity_id = $1";

    let rows = sqlx::query(query)
        .bind(&id)
        .fetch_all(pool)
        .await
        .expect("failed to get expenses");

    let mut expenses = Vec::new();

    for row in rows {
        let expense = get_expense_by_id(&row.get("id"), pool).await.unwrap();
        expenses.push(expense);
    }

    expenses
}
