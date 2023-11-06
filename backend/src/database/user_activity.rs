use crate::entities::{Activity, User};

pub async fn add_user_to_activity(
    user: &User,
    activity: &Activity,
    pool: &sqlx::PgPool,
) -> Result<(), Box<dyn std::error::Error>> {
    let query = "INSERT INTO users_activities (activity_id, user_id) VALUES ($1, $2)";

    let result = sqlx::query(query)
        .bind(&activity.id)
        .bind(&user.id)
        .execute(pool)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.into()),
    }
}

pub async fn add_user_to_activities(
    user: &User,
    activities: &Vec<&Activity>,
    pool: &sqlx::PgPool,
) -> Result<(), Box<dyn std::error::Error>> {
    for activity in activities {
        add_user_to_activity(user, activity, pool).await?;
    }

    Ok(())
}

pub async fn delete_user_from_activity(
    user: &User,
    activity: &Activity,
    pool: &sqlx::PgPool,
) -> Result<(), Box<dyn std::error::Error>> {
    let query = "DELETE FROM users_activities WHERE activity_id = $1 AND user_id = $2";

    let result = sqlx::query(query)
        .bind(&activity.id)
        .bind(&user.id)
        .execute(pool)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.into()),
    }
}

pub async fn delete_user_from_activities(
    user: &User,
    activities: &Vec<Activity>,
    pool: &sqlx::PgPool,
) -> Result<(), Box<dyn std::error::Error>> {
    let query = "DELETE FROM users_activities WHERE user_id = $1 AND activity_id = ANY($2)";

    let activity_ids = activities
        .iter()
        .map(|a| a.id.as_ref().unwrap().clone())
        .collect::<Vec<String>>();

    let result = sqlx::query(query)
        .bind(&user.id)
        .bind(&activity_ids)
        .execute(pool)
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.into()),
    }
}
