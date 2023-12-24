use std::{path::PathBuf, time::UNIX_EPOCH};

use axum::{
    debug_handler,
    extract::{self, Path},
    http::{Method, StatusCode},
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, Cors, CorsLayer};

#[derive(Debug, Serialize, Deserialize)]
struct Item {
    title: String,
    content: String,
    modified: u64,
}

#[derive(Debug, Deserialize)]
struct PayloadSave {
    title: String,
    content: String,
}

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new()
        .route("/health", get(check_health))
        .route("/items", get(read_all).post(create_item))
        .route("/items/:file_name", get(read_item).post(save_content))
        .layer(CorsLayer::permissive());

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[debug_handler]
async fn check_health() -> String {
    "Hello, world.".to_string()
}

#[debug_handler]
async fn read_all() -> extract::Json<Vec<Item>> {
    let mut result = Vec::new();
    for entry in std::fs::read_dir("data").unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            continue;
        } else {
            let item = Item {
                title: entry.file_name().as_os_str().to_str().unwrap().to_owned(),
                content: std::fs::read_to_string(&path).unwrap(),
                modified: get_modified_time(entry.metadata().unwrap()),
            };
            result.push(item);
        }
    }
    println!("[READ-ALL]");
    Json(result)
}

#[debug_handler]
async fn read_item(Path(file_name): Path<String>) -> Json<Item> {
    println!("file_name: {}", file_name);
    let path = create_path(&file_name);
    let item = Item {
        title: file_name.to_string(),
        content: std::fs::read_to_string(&path).unwrap(),
        modified: get_modified_time(path.metadata().unwrap()),
    };
    Json(item)
}

#[debug_handler]
async fn create_item(new_file_name: String) -> impl IntoResponse {
    println!("[CREATE] {}", new_file_name);
    match std::fs::File::create(create_path(&new_file_name)) {
        Ok(_) => return new_file_name.into_response(),
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Cannot create a new file.",
            )
                .into_response()
        }
    }
}

#[debug_handler]
async fn save_content(Json(payload): Json<PayloadSave>) -> impl IntoResponse {
    println!("[SAVE] {}", payload.title);
    let path = create_path(&payload.title);
    if !path.exists() {
        return (StatusCode::INTERNAL_SERVER_ERROR, "File does not exist.").into_response();
    } else {
        match std::fs::write(&path, &payload.content) {
            Err(e) => return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
            Ok(_) => {
                let modified = get_modified_time(path.metadata().unwrap());
                return Json(Item {
                    title: payload.title,
                    content: payload.content,
                    modified,
                })
                .into_response();
            }
        }
    }
}

fn create_path(name: &str) -> PathBuf {
    PathBuf::from(format!("data/{}", name))
}

fn get_modified_time(metadata: std::fs::Metadata) -> u64 {
    metadata
        .modified()
        .unwrap()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
