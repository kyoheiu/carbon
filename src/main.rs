mod error;
use error::Error;

use std::{path::PathBuf, time::UNIX_EPOCH};

use axum::{
    debug_handler,
    extract::{self, Path},
    http::{Method, StatusCode},
    response::IntoResponse,
    routing::{get, post},
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

#[derive(Debug, Deserialize)]
struct PayloadRename {
    title: String,
    new_title: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // build our application with a single route
    let app = Router::new()
        .route("/health", get(check_health))
        .route("/items", get(read_all).post(create_item))
        .route(
            "/items/:file_name",
            get(read_item).post(save_content).delete(delete_item),
        )
        .route("/items/rename", post(rename_item))
        .route("/items/search", post(search_item))
        .layer(CorsLayer::permissive());

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}

#[debug_handler]
async fn check_health() -> String {
    "Hello, world.".to_string()
}

#[debug_handler]
async fn read_all() -> Result<extract::Json<Vec<Item>>, Error> {
    let mut result = Vec::new();
    for entry in std::fs::read_dir("data")? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            continue;
        } else {
            let item = Item {
                title: entry
                    .file_name()
                    .as_os_str()
                    .to_str()
                    .ok_or(Error::ToUtf8)?
                    .to_owned(),
                content: std::fs::read_to_string(&path)?,
                modified: get_modified_time(entry.metadata()?)?,
            };
            result.push(item);
        }
    }
    println!("[READ-ALL]");
    Ok(Json(result))
}

#[debug_handler]
async fn read_item(Path(file_name): Path<String>) -> Result<Json<Item>, Error> {
    println!("[READ-ITEM] {}", file_name);
    let path = create_path(&file_name);
    let item = Item {
        title: file_name.to_string(),
        content: std::fs::read_to_string(&path)?,
        modified: get_modified_time(path.metadata()?)?,
    };
    Ok(Json(item))
}

#[debug_handler]
async fn create_item(new_file_name: String) -> Result<impl IntoResponse, Error> {
    println!("[CREATE] {}", new_file_name);
    std::fs::File::create(create_path(&new_file_name))?;
    Ok(new_file_name.into_response())
}

#[debug_handler]
async fn save_content(Json(payload): Json<PayloadSave>) -> Result<impl IntoResponse, Error> {
    println!("[SAVE] {}", payload.title);
    let path = create_path(&payload.title);
    if !path.exists() {
        Err(Error::NonExistentFile)
    } else {
        std::fs::write(&path, &payload.content)?;
        let modified = get_modified_time(path.metadata()?)?;
        Ok(Json(Item {
            title: payload.title,
            content: payload.content,
            modified,
        })
        .into_response())
    }
}

#[debug_handler]
async fn delete_item(Path(file_name): Path<String>) -> Result<impl IntoResponse, Error> {
    println!("[DELETE] {}", file_name);
    let path = create_path(&file_name);
    if !path.exists() {
        Err(Error::NonExistentFile)
    } else {
        std::fs::remove_file(&path)?;

        Ok((StatusCode::OK).into_response())
    }
}

#[debug_handler]
async fn rename_item(Json(payload): Json<PayloadRename>) -> Result<impl IntoResponse, Error> {
    println!("[RENAME] {} -> {}", payload.title, payload.new_title);
    let path = create_path(&payload.title);
    let new_path = create_path(&payload.new_title);
    if new_path.exists() {
        Err(Error::SameName)
    } else {
        std::fs::rename(path, &new_path)?;
        Ok((StatusCode::OK).into_response())
    }
}

#[debug_handler]
async fn search_item(query: String) -> Result<impl IntoResponse, Error> {
    println!("[SEARCH] {}", query);
    let mut result = std::collections::BTreeSet::new();
    //fd
    let output = std::process::Command::new("fd")
        .args([&query, "data"])
        .output()?
        .stdout;
    let output = String::from_utf8(output)?;
    for file in output.lines() {
        if !file.is_empty() {
            result.insert(file.to_string());
        }
    }

    //ripgrep
    let output = std::process::Command::new("rg")
        .args(["-i", "-l", &query, "data"])
        .output()?
        .stdout;
    let output = String::from_utf8(output)?;
    for file in output.lines() {
        if !file.is_empty() {
            result.insert(file.to_string());
        }
    }

    let mut items = Vec::new();
    for item in result {
        let title = item.split('/').last().ok_or(Error::Split)?.to_string();
        let path = PathBuf::from(&item);
        let content = std::fs::read_to_string(&path)?;
        let modified = get_modified_time(path.metadata()?)?;
        items.push(Item {
            title,
            content,
            modified,
        })
    }
    Ok(Json(items))
}

fn create_path(name: &str) -> PathBuf {
    PathBuf::from(format!("data/{}", name))
}

fn get_modified_time(metadata: std::fs::Metadata) -> Result<u64, Error> {
    Ok(metadata.modified()?.duration_since(UNIX_EPOCH)?.as_secs())
}
