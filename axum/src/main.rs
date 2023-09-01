mod error;

use axum::debug_handler;
use axum::extract::{Json, State};
use axum::response::Html;
use axum::{
    routing::{get, post},
    Router,
};
use error::Error;
use git2::Repository;
use serde::{Deserialize, Serialize};
use std::path::Path;
use tracing::{error, info};

const DATA_PATH: &str = "./data";

#[derive(Clone)]
struct Core {
    git_user: String,
    git_email: String,
}

impl Core {
    fn default() -> Result<Self, Error> {
        Ok(Core {
            git_user: std::env::var("CARBON_GIT_USER").unwrap_or("carbon".to_string()),
            git_email: std::env::var("CARBON_GIT_EMAIL").unwrap_or("git@example.com".to_string()),
        })
    }

    fn add_and_commit(&self, file_to_add: &str, file_to_delete: Option<&str>, commit_message: &str) -> Result<(), Error> {
        let repo = Repository::open(DATA_PATH)?;
        let mut index = repo.index()?;
        index.add_path(std::path::Path::new(file_to_add))?;
        if let Some(to_delete) =file_to_delete {
            index.remove_path(std::path::Path::new(to_delete))?;
        }
        index.write()?;

        let new_tree_oid = index.write_tree()?;
        let new_tree = repo.find_tree(new_tree_oid)?;
        let author = git2::Signature::now(&self.git_user, &self.git_email)?;
        let head = repo.head()?;
        let parent = repo.find_commit(
            head.target()
                .ok_or_else(|| Error::Git("Cannot get the OID.".to_string()))?,
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
}

#[derive(Debug, Serialize, Deserialize)]
struct Payload {
    original: String,
    new: String,
    content: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt().init();
    info!("Initialized logger.");
    let core = Core::default()?;

    let app = Router::new()
        .route("/health", get(health))
        .route("/git", post(add_and_commit))
        .with_state(core);

    axum::Server::bind(&"0.0.0.0:8080".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
    Ok(())
}

#[debug_handler]
async fn health() -> Html<&'static str> {
    Html("Hello, developer.")
}

#[debug_handler]
async fn add_and_commit(State(core): State<Core>, Json(payload): Json<Payload>) -> Result<(), Error> {
    if payload.original == payload.new {
        core.add_and_commit(&payload.new, None, "Update")?;
        Ok(info!("Update {}", payload.new))
    } else {
        if Path::new(&to_path_string(&payload.new)).exists() {
            error!("A file with the same name exists.");
            return Err(Error::SameName);
        }
        if !payload.original.is_empty() {
            let message = format!("Rename {} -> {}", payload.original, payload.new);
            core.add_and_commit(&payload.new, Some(&payload.original), &message)?;
            Ok(info!(message))
        } else {
            let message = format!("Create {}", payload.new);
            core.add_and_commit(&payload.new, None, &message)?;
            Ok(info!(message))
        }
    }
}

fn to_path_string(file_name: &str) -> String {
    format!("{}/{}", DATA_PATH, file_name)
}
