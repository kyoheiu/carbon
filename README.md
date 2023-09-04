# carbon
Self-hosted & git-powered online text editor.

## features
- carbon enables you to edit or delete files in `data` directory, or add a new one.
- Pressing <C-CR> inside the textarea will save the change.
  - If you set `CARBON_GIT_SERVER` env, the change will be automatically added to the git index and commited.
- No fancy editing feature such as WYSIWYG.
- No tags, no categories, no subdirectories.
- Texts with `.md` extension are converted to html in the view mode.
- Search powered by `fd-find` and `ripgrep` (regex pattern supported).

## deploy

1. If not initialized, `git init` in your `data` directory, which contains text files. Sub direcotries are not supported.
   To commit on save, add `user.name` and `user.email` to `data/.git/config` like this:
```
[user]
    name = Kyohei Uto
    email = "im@kyoheiu.dev"
```

2. Use `docker compose up -d` with `docker-compose.yml`. For example:

```
version: '3'
services:
  client:
    image: docker.io/kyoheiudev/carbon-client:0.2.0
    container_name: carbon-client
    volumes:
      - '/path/to/data:/carbon-client/data:rw'
    environment:
    # With this env, git support is enabled.
      - CARBON_GIT_SERVER=carbon-server
    ports:
      - 3000:3000
    logging:
      driver: json-file
      options:
        max-size: 1m
        max-file: '3'
  # If you do not want git support, omit `server` entirely!
  server:
    image: docker.io/kyoheiudev/carbon-server:0.2.0
    container_name: carbon-server
    # UID and GID that created Git repository.
    user: '1000:1000'
    volumes:
      - './data:/carbon-server/data:rw'
      - '/etc/passwd:/etc/passwd:ro'
      - '/etc/group:/etc/group:ro'
    environment:
      # default to 'carbon'
      - CARBON_GIT_USER="carbon"
      # default to 'git@example.com'
      - CARBON_GIT_EMAIL="git@example.com"
      - CARBON_DATA_PATH=data
    logging:
      driver: json-file
      options:
        max-size: 1m
        max-file: '3'
```

## tech stack
- frontend
  - SvelteKit
- server to support git
  - rust(axum)
  - libgit2
