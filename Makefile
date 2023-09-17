fmt:
	npm run format && npm run lint
	cd axum && cargo fmt

git:
	cd axum && RUST_LOG=debug cargo run

build:
	npm install --package-lock-only
	sudo docker build --tag=kyoheiudev/carbon:$(VER) .

push:
	sudo docker push kyoheiudev/carbon:$(VER)