use sqlx::Row;
use tide::{Request, Response};

use crate::{
    database::{self, expense::get_expense_by_id},
    dtos::ExpenseDto,
    entities::{Expense, Metadata},
};

pub async fn get_expense(request: Request<sqlx::PgPool>) -> tide::Result {
    let id: String = request.param("id")?.parse().unwrap();

    let expense = get_expense_by_id(&id, &request).await;

    if expense.is_err() {
        return Ok(Response::builder(500).build());
    }

    let expense = expense.unwrap();

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn post_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let pool = request.state().clone();

    let expense_dto = request
        .body_json::<ExpenseDto>()
        .await
        .expect("failed to parse expense");

    let id = database::expense::create_unique_expense_id(&pool).await;

    let user_id = expense_dto.user_id;
    let user_id = match user_id {
        Some(user_id) => user_id,
        None => {
            return Ok(Response::builder(500)
                .body(format!("Failed to create expense: user_id is required"))
                .build());
        }
    };

    let now = chrono::Utc::now();

    let metadata = Metadata {
        created_at: now,
        updated_at: now,
        deleted_at: None,
        is_deleted: false,
    };

    let expense = Expense {
        id: id.clone(),
        metadata: metadata,
        name: expense_dto.name.unwrap_or(String::from("unnamed expense")),
        amount: expense_dto.amount.unwrap_or(0.0),
        user_id: user_id,
        balance_ids: expense_dto.balance_ids.unwrap_or(Vec::new()),
    };

    let result = database::expense::insert_expense(&expense, &pool).await;
    if result.is_err() {
        return Ok(Response::builder(500)
            .body(format!(
                "Failed to create expense: {}",
                result.unwrap_err().to_string()
            ))
            .build());
    }

    let expense = get_expense_by_id(&id, &pool).await;
    let expense = match expense {
        Ok(expense) => expense,
        Err(_) => {
            return Ok(Response::builder(500)
                .body("Failed to get expense after creation")
                .build());
        }
    };

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn put_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expense_dto = request
        .body_json::<ExpenseDto>()
        .await
        .expect("failed to parse expenses");

    let expense_id = expense_dto.id.clone();
    let expense_id = match expense_id {
        Some(expense_id) => expense_id,
        None => {
            return Ok(Response::builder(500)
                .body(format!("Failed to update expense: id is required"))
                .build());
        }
    };

    let saved_expense = database::expense::get_expense_by_id(&expense_id, &request).await;
    let saved_expense = match saved_expense {
        Ok(saved_expense) => saved_expense,
        Err(_) => {
            return Ok(Response::builder(500)
                .body("Failed to update expense: expense not found")
                .build());
        }
    };

    let now = chrono::Utc::now();

    let expense = Expense {
        id: expense_id.clone(),
        metadata: Metadata {
            created_at: saved_expense.metadata.created_at,
            updated_at: now,
            deleted_at: saved_expense.metadata.deleted_at,
            is_deleted: saved_expense.metadata.is_deleted,
        },
        name: expense_dto.name.unwrap_or(String::from("unnamed expense")),
        amount: expense_dto.amount.unwrap_or(0.0),
        user_id: expense_dto.user_id.unwrap_or(String::from("")),
        balance_ids: expense_dto.balance_ids.unwrap_or(Vec::new()),
    };

    let result = database::expense::update_expense(&expense, &request).await;
    if result.is_err() {
        return Ok(Response::builder(500)
            .body(format!(
                "Failed to update expense: {}",
                result.unwrap_err().to_string()
            ))
            .build());
    }

    let expense = database::expense::get_expense_by_id(&expense_id, &request)
        .await
        .expect("expense not found");

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expense)?)
        .build())
}

pub async fn delete_expense(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let expenses = request
        .body_json::<Vec<ExpenseDto>>()
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

    let expenses = database::expense::get_expenses_by_activity_id(&id, &request).await;

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&expenses)?)
        .build())
}
