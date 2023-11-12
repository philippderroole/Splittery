use std::error::Error;

use sqlx::Row;
use tide::Request;

use crate::entities::{Balance, Metadata};

pub async fn get_balances_by_expense_id(
    id: &String,
    request: &Request<sqlx::PgPool>,
) -> Result<Vec<Balance>, Box<dyn Error>> {
    let query = "SELECT * FROM balances WHERE expense_id = $1";

    let rows = sqlx::query(query)
        .bind(&id)
        .fetch_all(request.state())
        .await
        .expect("failed to get balances");

    let mut balances = Vec::new();

    for row in rows {
        let balance = get_balance_by_user_id_and_expense_id(
            &row.get("user_id"),
            &row.get("expense_id"),
            request,
        )
        .await?;

        balances.push(balance);
    }

    Ok(balances)
}

pub async fn get_balance_by_user_id_and_expense_id(
    user_id: &String,
    expense_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Result<Balance, Box<dyn Error>> {
    let query = "SELECT * FROM balances WHERE user_id = $1 AND expense_id = $2";

    let row = sqlx::query(query)
        .bind(&user_id)
        .bind(&expense_id)
        .fetch_one(request.state())
        .await?;

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    Ok(Balance {
        amount: row.get("amount"),
        metadata: metadata,
        is_selected: row.get("is_selected"),
        share: row.get("share"),
        id: todo!(),
        user_id: todo!(),
    })
}
