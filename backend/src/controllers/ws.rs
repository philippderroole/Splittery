use axum::{
    extract::{
        Path, State,
        ws::{Message, WebSocket, WebSocketUpgrade},
    },
    response::IntoResponse,
};
use log::info;
use serde::Serialize;
use sqlx::PgPool;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{RwLock, broadcast};
use uuid::Uuid;

// Shared broadcaster for split updates
type SplitBroadcast = Arc<broadcast::Sender<String>>;

// Global broadcast channels per split
type SplitBroadcasters = Arc<RwLock<HashMap<String, SplitBroadcast>>>;

// Lazy static for global broadcasters
static SPLIT_BROADCASTERS: std::sync::OnceLock<SplitBroadcasters> = std::sync::OnceLock::new();

pub fn get_split_broadcasters() -> &'static SplitBroadcasters {
    SPLIT_BROADCASTERS.get_or_init(|| Arc::new(RwLock::new(HashMap::new())))
}

// WebSocket handler for split updates
pub async fn ws_split_updates(
    ws: WebSocketUpgrade,
    Path(split_url): Path<String>,
    State(_db): State<PgPool>,
) -> impl IntoResponse {
    info!("WebSocket connection for split info: {}", split_url);
    // Get or create broadcast channel for this split
    let broadcasters = get_split_broadcasters();
    let broadcast_tx = {
        let mut writers = broadcasters.write().await;
        writers
            .entry(split_url.clone())
            .or_insert_with(|| {
                let (tx, _) = broadcast::channel::<String>(100);
                Arc::new(tx)
            })
            .clone()
    };

    ws.on_upgrade(move |socket| handle_ws(socket, split_url, broadcast_tx))
}

async fn handle_ws(mut socket: WebSocket, _split_url: String, broadcast_tx: SplitBroadcast) {
    let mut rx = broadcast_tx.subscribe();

    // Optionally: send initial state here
    // You could fetch current split state and send it as initial message

    loop {
        tokio::select! {
            // Receive broadcasted updates
            Ok(msg) = rx.recv() => {
                if socket.send(Message::Text(msg.into())).await.is_err() {
                    break;
                }
            }
            // Handle incoming client messages (optional)
            result = socket.recv() => {
                match result {
                    Some(Ok(Message::Close(_))) | None => break,
                    Some(Ok(Message::Text(_text))) => {
                        // Could handle client messages here if needed
                    }
                    _ => {}
                }
            }
        }
    }
}

#[derive(Serialize, Debug, Clone)]
#[serde(tag = "type", content = "payload")]
pub enum SplitUpdateMessage {
    SplitChanged {
        split_id: Uuid,
        name: String,
    },
    SplitDeleted {
        split_id: Uuid,
    },
    TransactionCreated {
        transaction_id: uuid::Uuid,
    },
    TransactionUpdated {
        transaction_id: uuid::Uuid,
    },
    TransactionDeleted {
        transaction_id: uuid::Uuid,
    },
    TransactionItemCreated {
        item_id: uuid::Uuid,
        transaction_id: uuid::Uuid,
    },
    TransactionItemUpdated {
        item_id: uuid::Uuid,
        transaction_id: uuid::Uuid,
    },
    TransactionItemDeleted {
        item_id: uuid::Uuid,
        transaction_id: uuid::Uuid,
    },
    // Add more as needed
}

pub async fn ensure_split_broadcaster(split_url: &str) -> SplitBroadcast {
    let broadcasters = get_split_broadcasters();
    let mut writers = broadcasters.write().await;
    writers
        .entry(split_url.to_string())
        .or_insert_with(|| {
            let (tx, _) = broadcast::channel::<String>(100);
            Arc::new(tx)
        })
        .clone()
}

pub async fn broadcast_split_update(split_url: &str, msg: &SplitUpdateMessage) {
    let broadcast_tx = ensure_split_broadcaster(split_url).await;

    if let Ok(json) = serde_json::to_string(msg) {
        let _ = broadcast_tx.send(json);
    }
}
