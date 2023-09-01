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
use tower_http::cors::{Any, CorsLayer};
use tracing::info;

#[derive(Clone)]
struct Core {
    git_user: String,
    git_email: String,
    data_path: String,
}

impl Core {
    fn default() -> Result<Self, Error> {
        Ok(Core {
            git_user: std::env::var("CARBON_GIT_USER").unwrap_or("carbon".to_string()),
            git_email: std::env::var("CARBON_GIT_EMAIL").unwrap_or("git@example.com".to_string()),
            data_path: std::env::var("CARBON_DATA_PATH").unwrap_or("../data".to_string()),
        })
    }

    fn add_and_commit(
        &self,
        file_to_add: &str,
        file_to_delete: Option<&str>,
        commit_message: &str,
    ) -> Result<(), Error> {
        let repo = Repository::open(&self.data_path)?;
        let mut index = repo.index()?;
        index.add_path(std::path::Path::new(file_to_add))?;
        if let Some(to_delete) = file_to_delete {
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

#[derive(Debug, Serialize, Deserialize)]
struct PayloadToDelete {
    file: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt().init();
    info!("Initialized logger.");
    let core = Core::default()?;

    let layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers(Any)
        .allow_methods(Any);

    let app = Router::new()
        .route("/health", get(health))
        .route("/git", post(add_and_commit).delete(delete_and_commit))
        .layer(layer)
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
async fn add_and_commit(
    State(core): State<Core>,
    Json(payload): Json<Payload>,
) -> Result<(), Error> {
    if payload.original == payload.new {
        core.add_and_commit(&payload.new, None, "Update")?;
        Ok(info!("Update {}", payload.new))
    } else {
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

#[debug_handler]
async fn delete_and_commit(
    State(core): State<Core>,
    Json(payload): Json<Payload>,
) -> Result<(), Error> {
    if payload.original == payload.new {
        let message = format!("Update {}", payload.new);
        core.add_and_commit(&payload.new, None, &message)?;
        Ok(info!("Update {}", message))
    } else {
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
