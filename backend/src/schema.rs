// @generated automatically by Diesel CLI.

diesel::table! {
    activity (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        created_at -> Timestamp,
        modified_at -> Timestamp,
        deleted_at -> Nullable<Timestamp>,
        is_deleted -> Bool,
    }
}

diesel::table! {
    balance (id) {
        #[max_length = 255]
        id -> Varchar,
    }
}

diesel::table! {
    expense (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        amount -> Numeric,
        #[max_length = 255]
        activity_id -> Varchar,
        created_at -> Timestamp,
        modified_at -> Timestamp,
        deleted_at -> Nullable<Timestamp>,
        is_deleted -> Bool,
    }
}

diesel::table! {
    splitteryuser (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
    }
}

diesel::table! {
    useractivity (user_id, activity_id) {
        #[max_length = 255]
        user_id -> Varchar,
        #[max_length = 255]
        activity_id -> Varchar,
    }
}

diesel::joinable!(expense -> activity (activity_id));
diesel::joinable!(useractivity -> activity (activity_id));
diesel::joinable!(useractivity -> splitteryuser (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    activity,
    balance,
    expense,
    splitteryuser,
    useractivity,
);
