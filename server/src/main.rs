mod error;

use axum::{
    debug_handler,
    extract::{self, Path},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use error::Error;
use git2::Repository;
use serde::{Deserialize, Serialize};
use std::{path::PathBuf, time::UNIX_EPOCH};
use tower_http::{cors::CorsLayer, services::ServeDir};
use tracing::info;
use tracing_subscriber;

#[derive(Debug, Serialize, Deserialize)]
struct ListItem {
    title: String,
    modified: u64,
}

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

#[derive(Debug, Serialize)]
struct ReadResponse {
    result: Vec<ListItem>,
    more: bool,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt::init();

    let static_dir = ServeDir::new("static");
    let app = Router::new()
        .route("/health", get(check_health))
        .route("/api/items", get(read_partial).post(create_item))
        .route("/api/items_all", get(read_all))
        .route(
            "/api/items/:file_name",
            get(read_item).post(save_item).delete(delete_item),
        )
        .route("/api/rename", post(rename_item))
        .route("/api/search", post(search_item))
        .nest_service("/", static_dir.clone())
        .nest_service("/items/:file_name", static_dir.clone())
        .nest_service("/search", static_dir)
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}

#[debug_handler]
async fn check_health() -> String {
    "Hello, world.".to_string()
}

#[debug_handler]
async fn read_all() -> Result<extract::Json<Vec<ListItem>>, Error> {
    let result = read_data()?;
    Ok(Json(result))
}

#[debug_handler]
async fn read_partial() -> Result<extract::Json<ReadResponse>, Error> {
    let all = read_data()?;
    let more = &all.len() > &10;

    let mut result = Vec::new();
    let mut i = 0;
    for item in all {
        result.push(item);
        i += 1;
        if i == 10 {
            break;
        }
    }

    Ok(Json(ReadResponse { result, more }))
}

#[debug_handler]
async fn read_item(Path(file_name): Path<String>) -> Result<Json<Item>, Error> {
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
    info!("[CREATE] {}", new_file_name);
    let path = create_path(&new_file_name);
    if path.exists() {
        Err(Error::SameName)
    } else {
        std::fs::File::create(create_path(&new_file_name))?;
        if is_git_supported() {
            let msg = format!("Create: {}", &new_file_name);
            add_and_commit(&new_file_name, None, &msg)?;
        }
        Ok(new_file_name.into_response())
    }
}

#[debug_handler]
async fn save_item(Json(payload): Json<PayloadSave>) -> Result<impl IntoResponse, Error> {
    info!("[SAVE] {}", payload.title);
    let path = create_path(&payload.title);
    if !path.exists() {
        Err(Error::NonExistentFile)
    } else {
        std::fs::write(&path, &payload.content)?;
        if is_git_supported() {
            let msg = format!("Update: {}", payload.title);
            add_and_commit(&payload.title, None, &msg)?;
        }
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
    info!("[DELETE] {}", file_name);
    let path = create_path(&file_name);
    if !path.exists() {
        Err(Error::NonExistentFile)
    } else {
        std::fs::remove_file(&path)?;
        if is_git_supported() {
            let msg = format!("Delete: {}", &file_name);
            delete_and_commit(&file_name, &msg)?;
        }
        Ok((StatusCode::OK).into_response())
    }
}

#[debug_handler]
async fn rename_item(Json(payload): Json<PayloadRename>) -> Result<impl IntoResponse, Error> {
    info!("[RENAME] {} -> {}", payload.title, payload.new_title);
    let path = create_path(&payload.title);
    let new_path = create_path(&payload.new_title);
    if new_path.exists() {
        Err(Error::SameName)
    } else {
        std::fs::rename(path, &new_path)?;
        if is_git_supported() {
            let msg = format!("Rename: {} -> {}", &payload.title, &payload.new_title);
            add_and_commit(&payload.new_title, Some(&payload.title), &msg)?;
        }
        Ok((StatusCode::OK).into_response())
    }
}

#[debug_handler]
async fn search_item(query: String) -> Result<impl IntoResponse, Error> {
    let mut result = std::collections::BTreeSet::new();
    //fd
    let output = std::process::Command::new("fd")
        .args([&query, "./data"])
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
        .args(["-i", "-l", &query, "./data"])
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

fn read_data() -> Result<Vec<ListItem>, Error> {
    let mut result = Vec::new();
    for entry in std::fs::read_dir("data")? {
        let entry = entry?;
        let metadata = entry.metadata()?;
        if !metadata.file_type().is_file() {
            continue;
        } else {
            let item = ListItem {
                title: entry
                    .file_name()
                    .as_os_str()
                    .to_str()
                    .ok_or(Error::ToUtf8)?
                    .to_owned(),
                modified: get_modified_time(metadata)?,
            };
            result.push(item);
        }
    }
    result.sort_by(|a, b| b.modified.cmp(&a.modified));
    Ok(result)
}

fn add_and_commit(
    file_to_add: &str,
    file_to_delete: Option<&str>,
    commit_message: &str,
) -> Result<(), Error> {
    let repo = Repository::open("./data")?;
    let mut index = repo.index()?;
    index.add_path(std::path::Path::new(file_to_add))?;
    if let Some(to_delete) = file_to_delete {
        index.remove_path(std::path::Path::new(to_delete))?;
    }
    index.write()?;

    let new_tree_oid = index.write_tree()?;
    let new_tree = repo.find_tree(new_tree_oid)?;
    let git_config = get_git_config();
    let author = git2::Signature::now(&git_config.0, &git_config.1)?;
    let head = repo.head()?;
    let parent = repo.find_commit(
        head.target()
            .ok_or_else(|| Error::Git("Failed get the OID.".to_string()))?,
    )?;
    repo.commit(
        Some("HEAD"),
        &author,
        &author,
        commit_message,
        &new_tree,
        &[&parent],
    )?;

    Ok(())
}

fn delete_and_commit(file_to_delete: &str, commit_message: &str) -> Result<(), Error> {
    let repo = Repository::open("./data")?;
    let mut index = repo.index()?;
    index.remove_path(std::path::Path::new(file_to_delete))?;
    index.write()?;

    let new_tree_oid = index.write_tree()?;
    let new_tree = repo.find_tree(new_tree_oid)?;
    let git_config = get_git_config();
    let author = git2::Signature::now(&git_config.0, &git_config.1)?;
    let head = repo.head()?;
    let parent = repo.find_commit(
        head.target()
            .ok_or_else(|| Error::Git("Failed get the OID.".to_string()))?,
    )?;
    repo.commit(
        Some("HEAD"),
        &author,
        &author,
        commit_message,
        &new_tree,
        &[&parent],
    )?;

    Ok(())
}

fn get_git_config() -> (String, String) {
    (
        std::env::var("CARBON_GIT_USER").unwrap_or("carbon".to_string()),
        std::env::var("CARBON_GIT_EMAIL").unwrap_or("git@example.com".to_string()),
    )
}

fn is_git_supported() -> bool {
    std::env::var("CARBON_GIT") == Ok("on".to_string())
}
