use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};
use tracing::error;

#[derive(Debug)]
pub enum Error {
    Io(String),
    FromUtf8(String),
    NonExistentFile,
    SystemTime,
    SameName,
    Split,
    ToUtf8,
    Git(String),
}

impl From<git2::Error> for Error {
    fn from(err: git2::Error) -> Self {
        Error::Git(err.to_string())
    }
}
impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        let printable = match self {
            Error::Io(s) => s,
            Error::FromUtf8(s) => s,
            Error::NonExistentFile => "File does not exist.",
            Error::SystemTime => "SystemTimeError.",
            Error::SameName => "A file with the same name exists.",
            Error::Split => "Cannot split the file path.",
            Error::ToUtf8 => "Cannot read file name as UTF-8.",
            Error::Git(s) => s,
        };
        write!(f, "{}", printable)
    }
}

impl From<std::io::Error> for Error {
    fn from(err: std::io::Error) -> Self {
        Error::Io(err.to_string())
    }
}

impl From<std::time::SystemTimeError> for Error {
    fn from(_err: std::time::SystemTimeError) -> Self {
        Error::SystemTime
    }
}

impl From<std::string::FromUtf8Error> for Error {
    fn from(err: std::string::FromUtf8Error) -> Self {
        Error::FromUtf8(err.to_string())
    }
}
impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let body = match self {
            Error::Io(s) => s,
            Error::FromUtf8(s) => s,
            Error::NonExistentFile => "File does not exist".to_string(),
            Error::SystemTime => "SystemTimeError.".to_string(),
            Error::SameName => "A file with the same name exists.".to_string(),
            Error::Split => "Cannot split the file path.".to_string(),
            Error::ToUtf8 => "Cannot read file name as UTF-8.".to_string(),
            Error::Git(s) => s,
        };
        error!(body);
        (StatusCode::INTERNAL_SERVER_ERROR, body).into_response()
    }
}
