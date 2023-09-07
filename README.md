# carbon

An opinionated online text editor, self-hosted & Git-powered. _Like a carbon paper_, through this app you can edit your text files in a single, flat directory on your server.  
Aims to be alternative to Google Keep, Simplenote, Evernote, and so on.

![screenshot.png](/screenshot/screenshot.png)

[demo site](https://carbon-demo.kyoheiu.dev/)
(Without the git feature; reset every 15 minutes)

## features

- No collaborative editing – it's designed for individual use.
- No fancy editing feature such as WYSIWYG or image rendering.
- No tags, categories, or subdirectories to keep things straightforward.
- Pressing `<C-CR>` inside the textarea will save the change.
  - Optionally, the change can be automatically added and commited to the Git repository.
- Keeps scroll position between view mode and edit mode.
- Texts with `.md` extension are converted to html in the view mode.
- KaTeX supported.
- Search powered by `fd-find` and `ripgrep` (regex pattern supported).

## deploy

Here, assume that you store text files in `/path/to/data`.

1. If you'd like to use the git feature, `git init && git add -A && git commit -m "Initial commit"` in `data`.
   After that, add `user.name` and `user.email` to `data/.git/config` like this:

```
[user]
    name = Kyohei Uto
    email = "im@kyoheiu.dev"
```

If you do not want the git feature, skip this step and go on to the next (and final) one.

2. Use `docker compose up -d` with `docker-compose.yml`. For example:

```
version: '3'
services:
  client:
    image: docker.io/kyoheiudev/carbon-client:0.2.3
    container_name: carbon-client
    volumes:
      - '/path/to/data:/carbon-client/data:rw'
    environment:
    # If you do not want the git feature, omit this!
      - CARBON_GIT_SERVER=carbon-server
    ports:
      - 3000:3000
    logging:
      driver: json-file
      options:
        max-size: 1m
        max-file: '3'
  # If you don't want the git feature, omit `server` entirely!
  server:
    image: docker.io/kyoheiudev/carbon-server:0.2.3
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
  - tailwind
- server to support git
  - rust(axum)
  - libgit2

## Contributing

Contributions are very welcome!

If you have an idea for a new feature, please create an issue before making PR.
