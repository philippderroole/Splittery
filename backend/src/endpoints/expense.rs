use sqlx::Row;
use tide::{Request, Response};

use crate::{endpoints::create_id, Activity, Expense, User};

use super::balance::{create_balances, get_balances_by_expense_id};

pub async fn create_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expense = request
        .body_json::<Expense>()
        .await
        .expect("failed to parse expense");

    let balances = expense.balances;

    let id = create_unique_expense_id(&request.state()).await;

    let query = "INSERT INTO expenses (id, name, amount, activity_id, user_name) VALUES ($1, $2, $3, $4, $5)";

    let _ = sqlx::query(query)
        .bind(&id)
        .bind(&expense.name)
        .bind(&expense.amount)
        .bind(&expense.user.activity.id)
        .bind(&expense.user.name)
        .execute(request.state())
        .await
        .expect("failed to create expense");

    let query = "SELECT * FROM expenses WHERE id = $1";

    let row = sqlx::query(query)
        .bind(&id)
        .fetch_one(request.state())
        .await
        .unwrap();

    let mut expense = Expense {
        id: row.get("id"),
        name: row.get("name"),
        amount: row.get("amount"),
        user: User {
            name: row.get("user_name"),
            activity: Activity {
                id: row.get("activity_id"),
            },
        },
        balances: Vec::new(),
    };

    expense.balances = create_balances(&balances, &expense, &request).await;

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn get_all_expenses(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity = request
        .body_json::<Activity>()
        .await
        .expect("failed to parse activity");

    let query = "SELECT * FROM expenses WHERE activity_id = $1";

    let rows = sqlx::query(query)
        .bind(&activity.id)
        .fetch_all(request.state())
        .await
        .expect("failed to get expenses");

    let mut expenses = Vec::new();

    for row in rows {
        let expense = Expense {
            id: row.get("id"),
            name: row.get("name"),
            amount: row.get("amount"),
            user: User {
                name: row.get("user_name"),
                activity: activity.clone(),
            },
            balances: get_balances_by_expense_id(&row.get("id"), &request).await,
        };

        expenses.push(expense);
    }

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expenses)?)
        .build())
}

async fn create_unique_expense_id(pool: &sqlx::PgPool) -> String {
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
