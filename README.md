# carbon

An opinionated online text editor, self-hosted & Git-powered.

_Like a carbon paper_, through this app you can edit your text files in a single, flat directory on your server.

Aims to be alternative to Google Keep, Simplenote, Evernote, and so on.

[demo site](https://carbon-demo.kyoheiu.dev/)
(Without the git feature; reset every 15 minutes)

## releases

### v2.0.0 (2024-01-01)

- Renew the architecture overall.
  - Use React and react-router for the client side.
  - Rust (axum) for the server side.
  - Just one docker image to launch the app.

If you receive `Permission denied` error when upgrading from v1, please execute the command below.

```
# chown -R $(id -u):$(id -g) /path/to/data
```

## features

- No collaborative editing – it's designed for individual use.
- No fancy editing feature such as WYSIWYG or image rendering.
- To keep things straightforward, no tags, categories, or subdirectories
- Press `Ctrl + Enter` in the textarea to save the change.
  - Optionally, the change can be automatically added and commited to the Git repository.
- Texts with `.md` extension are converted to html in the view mode.
- Search powered by `fd-find` and `ripgrep` (regex pattern supported).

## deploy

Here, assume that you store text files in `/path/to/data`.

1. If you'd like to use the git feature, create a git repository in your `data`.
   After that, add `user.name` and `user.email` to `data/.git/config` like this:

```
[user]
    name = Kyohei Uto
    email = "im@kyoheiu.dev"
```

If you do not want the git feature, skip this step and go on to the next (and final) one.

2. Use `docker compose up -d` with `docker-compose.yml`. For example:

```
version: "3"
services:
  carbon:
    image: docker.io/kyoheiudev/carbon:2.0.2
    container_name: carbon
    user: "1000:1000" # UID and GID that created git repository.
    volumes:
      - "./data:/carbon/data:rw"
      - "/etc/passwd:/etc/passwd:ro"
      - "/etc/group:/etc/group:ro"
    environment:
      - CARBON_GIT=on # requited to enable the git feature
      - CARBON_GIT_USER=carbon # default to 'carbon'
      - CARBON_GIT_EMAIL=git@example.com # default to 'git@example.com'
    ports:
      - 3000:3000
    logging:
      driver: json-file
      options:
        max-size: 1m
        max-file: "3"
```

And the app will start listening on port 3000.

## tech stack

- client side
  - React, react-router
  - tailwind, PrimeReact
- server side
  - Rust(axum)
  - libgit2

## Contributing

Contributions are very welcome!

If you have an idea for a new feature, please create an issue before making PR.

### Development

#### Prerequisites

- `npm` for the clientside
- `cargo` for the server side

```
cd client && npm i
cd .. && make dev
```

For details, see `Makefile`.
