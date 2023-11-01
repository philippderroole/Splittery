use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::activities)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Activities {
    pub id: String,
}
