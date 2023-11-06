use sqlx::Row;
use tide::{Request, Response};

use crate::{
    database::{
        self,
        expense::{create_unique_expense_id, get_expense_by_id},
    },
    entities::Expense,
};

pub async fn get_expense(request: Request<sqlx::PgPool>) -> tide::Result {
    let id: String = request.param("id")?.parse().unwrap();

    let expense = get_expense_by_id(&id, request.state()).await;

    if expense.is_err() {
        return Ok(Response::builder(500).build());
    }

    let expense = expense.unwrap();

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn post_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expense = request
        .body_json::<Expense>()
        .await
        .expect("failed to parse expense");

    let id = create_unique_expense_id(&request.state()).await;

    let query =
        "INSERT INTO expenses (id, name, amount, activity_id, user_id) VALUES ($1, $2, $3, $4, $5)";

    let _ = sqlx::query(query)
        .bind(&id)
        .bind(&expense.name)
        .bind(&expense.amount)
        .bind(&expense.user.activity_ids)
        .bind(&expense.user.id)
        .execute(request.state())
        .await
        .expect("failed to create expense");

    let expense = get_expense_by_id(&id, request.state()).await;

    if expense.is_err() {
        return Ok(Response::builder(500).build());
    }

    let expense = expense.unwrap();

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn put_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expense = request
        .body_json::<Expense>()
        .await
        .expect("failed to parse expenses");

    let query = "UPDATE expenses SET name = $1, amount = $2, activity_id = $3, user_name = $4 WHERE id = $5";

    let _ = sqlx::query(query)
        .bind(&expense.name)
        .bind(&expense.amount)
        .bind(&expense.user.activity_ids)
        .bind(&expense.user.name)
        .bind(&expense.id)
        .execute(request.state())
        .await
        .expect("failed to update expense");

    let expense = get_expense_by_id(&expense.id, request.state())
        .await
        .expect("expense not found");

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn delete_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expenses = request
        .body_json::<Vec<Expense>>()
        .await
        .expect("failed to parse expenses");

    for expense in expenses {
        let query = "DELETE FROM expenses WHERE id = $1";

        let _ = sqlx::query(query)
            .bind(&expense.id)
            .execute(request.state())
            .await
            .expect("failed to delete expense");
    }

    Ok(Response::builder(200).build())
}

pub async fn get_expense_count(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "SELECT COUNT(*) FROM expenses";

    let row = sqlx::query(query).fetch_one(request.state()).await?;

    let amount = row.get::<i64, usize>(0);

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&amount)?)
        .build())
}

pub async fn get_expenses_by_activity_id(request: Request<sqlx::PgPool>) -> tide::Result {
    let id: String = request.param("id")?.parse().unwrap();

    let expenses = database::expense::get_expenses_by_activity_id(&id, request.state()).await;

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expenses)?)
        .build())
}
