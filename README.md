# carbon

Self-hosted & git-powered online text editor. Keeps text files in a flat directory structure. Particularly suited for users who prefer a straightforward and Git-integrated text editing experience without fancy features.

![screenshot.png](/screenshot/screenshot.png)

## features

- _Like a carbon paper_, through this app you can edit your text files in a single, flat directory on your server.
- Pressing <C-CR> inside the textarea will save the change.
  - Optionally, the change can be automatically added and commited to the Git repository.
- No fancy editing feature such as WYSIWYG.
- No tags, no categories, no subdirectories.
- Keep scroll position between the view mode and edit mode.
- Texts with `.md` extension are converted to html in the view mode.
- Search powered by `fd-find` and `ripgrep` (regex pattern supported).

## deploy

1. If you'd like to use the git feature, `git init && git add -A && git commit -m "Initial commit"` in your directory that contains text files. _Sub direcotries are not supported._
   After that, add `user.name` and `user.email` to `data/.git/config` like this:

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
  # If you do not want the git feature, omit `server` entirely!
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

And the app will start listening on port 3000.

## tech stack

- frontend
  - SvelteKit
- server to support git
  - rust(axum)
  - libgit2
