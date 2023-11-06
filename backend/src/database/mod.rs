use rand::{distributions::Alphanumeric, Rng};

pub mod activity;
pub mod balance;
pub mod expense;
pub mod user;
pub mod user_activity;

fn create_id(length: usize) -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(length)
        .map(char::from)
        .collect()
}
