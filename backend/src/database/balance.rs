use std::error::Error;

use sqlx::Row;

use crate::entities::{Balance, Metadata};

use super::user::get_user_by_id;

pub async fn get_balances_by_expense_id(
    id: &String,
    pool: &sqlx::PgPool,
) -> Result<Vec<Balance>, Box<dyn Error>> {
    let query = "SELECT * FROM balances WHERE expense_id = $1";

    let rows = sqlx::query(query)
        .bind(&id)
        .fetch_all(pool)
        .await
        .expect("failed to get balances");

    let mut balances = Vec::new();

    for row in rows {
        let balance = get_balance_by_user_id_and_expense_id(
            &row.get("user_id"),
            &row.get("expense_id"),
            pool,
        )
        .await?;

        balances.push(balance);
    }

    Ok(balances)
}

pub async fn get_balance_by_user_id_and_expense_id(
    user_id: &String,
    expense_id: &String,
    pool: &sqlx::PgPool,
) -> Result<Balance, Box<dyn Error>> {
    let query = "SELECT * FROM balances WHERE user_id = $1 AND expense_id = $2";

    let row = sqlx::query(query)
        .bind(&user_id)
        .bind(&expense_id)
        .fetch_one(pool)
        .await?;

    let user = get_user_by_id(&row.get("user_id"), pool).await?;

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    Ok(Balance {
        user: Some(user),
        amount: row.get("amount"),
        metadata: Some(metadata),
        is_selected: row.get("is_selected"),
        share: row.get("share"),
    })
}
