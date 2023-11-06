use chrono::{DateTime, Utc};
use diesel::prelude::*;

pub struct Metadata {
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_deleted: bool,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::activity)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Activity {
    pub id: String,
    pub expenses: Vec<Expense>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_deleted: bool,
}

#[derive(Queryable, Selectable)]
#[diesel(belongs_to(Activity))]
#[diesel(table_name = crate::schema::expense)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Expense {
    pub metadata: Option<Metadata>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub user: Option<User>,
    pub balances: Option<Vec<Balance>>,
}

#[derive(Queryable, Selectable)]
#[diesel(belongs_to(Expense))]
#[diesel(table_name = crate::schema::balance)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Balance {
    pub metadata: Option<Metadata>,
    pub is_selected: Option<bool>,
    pub amount: Option<f64>,
    pub share: Option<f64>,
    pub user: Option<User>,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::splitteryuser)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub metadata: Option<Metadata>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub activity_ids: Option<Vec<String>>,
}

#[derive(Queryable, Selectable)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Activity))]
#[diesel(table_name = crate::schema::useractivity)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(user_id, activity_id))]
pub struct UserActivity {
    pub user_id: String,
    pub activity_id: String,
}
