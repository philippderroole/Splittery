use sqlx::PgPool;
use uuid::Uuid;

pub async fn logout(pool: &PgPool, session_id: Uuid) -> anyhow::Result<()> {
    sqlx::query!(
        "
        UPDATE sessions
        SET revoked_at = NOW()
        WHERE id = $1
        ",
        session_id
    )
    .execute(pool)
    .await?;

    Ok(())
}
