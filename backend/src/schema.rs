// @generated automatically by Diesel CLI.

diesel::table! {
    activities (id) {
        id -> Varchar,
    }
}

diesel::table! {
    balances (user_name, activity_id, expense_id) {
        user_name -> Varchar,
        activity_id -> Varchar,
        amount -> Float8,
        expense_id -> Varchar,
        is_selected -> Bool,
        share -> Float8,
    }
}

diesel::table! {
    expenses (id) {
        id -> Varchar,
        name -> Varchar,
        amount -> Float8,
        user_name -> Varchar,
        activity_id -> Varchar,
    }
}

diesel::table! {
    users (name, activity_id) {
        name -> Varchar,
        activity_id -> Varchar,
    }
}

diesel::joinable!(balances -> activities (activity_id));
diesel::joinable!(balances -> expenses (expense_id));
diesel::joinable!(expenses -> activities (activity_id));
diesel::joinable!(users -> activities (activity_id));

diesel::allow_tables_to_appear_in_same_query!(
    activities,
    balances,
    expenses,
    users,
);
