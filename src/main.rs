use std::time::UNIX_EPOCH;

use axum::{
    debug_handler,
    extract::{self, Path},
    http::Method,
    routing::get,
    Json, Router,
};
use serde::Serialize;
use tower_http::cors::{Any, Cors, CorsLayer};

#[derive(Debug, Serialize)]
struct Item {
    title: String,
    content: String,
    modified: u64,
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods(Any)
        // allow requests from any origin
        .allow_origin(Any);

    // build our application with a single route
    let app = Router::new()
        .route("/health", get(check_health))
        .route("/items", get(read_all).post(create_item))
        .route("/items/:file_name", get(read_item))
        .layer(cors);

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
                modified: entry
                    .metadata()
                    .unwrap()
                    .modified()
                    .unwrap()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
            };
            result.push(item);
        }
    }
    println!("[READ-ALL]: {:?}", result);
    Json(result)
}

#[debug_handler]
async fn read_item(Path(file_name): Path<String>) -> Json<Item> {
    println!("file_name: {}", file_name);
    let p = format!("data/{}", file_name);
    let path = std::path::Path::new(&p);
    let item = Item {
        title: file_name.to_string(),
        content: std::fs::read_to_string(&p).unwrap(),
        modified: path
            .metadata()
            .unwrap()
            .modified()
            .unwrap()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs(),
    };
    Json(item)
}

#[debug_handler]
async fn create_item() -> String {
    println!("[CREATE] NEW FILE");
    let new_file_name_prefix = "untitled_";
    let mut i: usize = 1;
    loop {
        let new_file_name = format!("{}{}", new_file_name_prefix, i);
        let new_file_path = std::path::PathBuf::from(format!("data/{}", new_file_name));
        if std::path::PathBuf::from(&new_file_path).exists() {
            i += 1;
            continue;
        } else {
            std::fs::File::create(&new_file_path).unwrap();
            return new_file_name;
        }
    }
}
