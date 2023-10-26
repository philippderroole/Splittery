use sqlx::Row;
use tide::Request;

use crate::{Activity, Balance, Expense, User};

pub async fn create_balances(
    balances: &Vec<Balance>,
    expense: &Expense,
    request: &Request<sqlx::PgPool>,
) -> Vec<Balance> {
    let mut created_balances = Vec::new();

    for balance in balances {
        created_balances.push(create_balance(&balance, expense, &request).await);
    }

    created_balances
}

pub async fn create_balance(
    balance: &Balance,
    expense: &Expense,
    request: &Request<sqlx::PgPool>,
) -> Balance {
    let query = "INSERT INTO balances (user_name, activity_id, amount, expense_id, is_selected, share) VALUES ($1, $2, $3, $4, $5, $6)";

    let _ = sqlx::query(query)
        .bind(&balance.user.name)
        .bind(&balance.user.activity.id)
        .bind(&balance.amount)
        .bind(&expense.id)
        .bind(&balance.is_selected)
        .bind(&balance.share)
        .execute(request.state())
        .await
        .expect("failed to create balance");

    let query =
        "SELECT * FROM balances WHERE user_name = $1 AND activity_id = $2 AND expense_id = $3";

    let row = sqlx::query(query)
        .bind(&balance.user.name)
        .bind(&balance.user.activity.id)
        .bind(&expense.id)
        .fetch_one(request.state())
        .await
        .expect("failed to get balances");

    Balance {
        is_selected: row.get("is_selected"),
        amount: row.get("amount"),
        share: row.get("share"),
        user: User {
            name: row.get("user_name"),
            activity: Activity {
                id: row.get("activity_id"),
            },
        },
    }
}

pub async fn get_balances_by_expense_id(
    expense_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Vec<Balance> {
    let query = "SELECT * FROM balances WHERE expense_id = $1";

    let rows = sqlx::query(query)
        .bind(&expense_id)
        .fetch_all(request.state())
        .await
        .expect("failed to get balances");

    rows.iter()
        .map(|row| Balance {
            is_selected: row.get("is_selected"),
            amount: row.get("amount"),
            share: row.get("share"),
            user: User {
                name: row.get("user_name"),
                activity: Activity {
                    id: row.get("activity_id"),
                },
            },
        })
        .collect::<Vec<Balance>>()
}
