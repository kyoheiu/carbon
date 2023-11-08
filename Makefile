fmt:
	npm run format && npm run lint
	cd axum && cargo fmt

git:
	cd axum && RUST_LOG=debug cargo run

build:
	npm install --package-lock-only
	podman build --tag=kyoheiudev/carbon:$(VER) .

push:
	podman push kyoheiudev/carbon:$(VER)

build-all:
	npm install --package-lock-only
	cd axum && cargo generate-lockfile
	podman build --tag=kyoheiudev/carbon:$(F_VER) .
	cd axum && podman build --tag=kyoheiudev/carbon-git:$(B_VER) .

push-all:
	podman push kyoheiudev/carbon:$(F_VER)
	podman push kyoheiudev/carbon-git:$(B_VER)
