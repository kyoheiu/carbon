fmt:
	npm run format && npm run lint
	cd axum && cargo fmt

fe:
	npm run dev

be:
	cd axum && RUST_LOG=debug cargo run

build:
	npm install --package-lock-only
	cd axum && cargo generate-lockfile
	sudo docker build --tag=kyoheiudev/carbon-client:$(F_VER) .
	cd axum && sudo docker build --tag=kyoheiudev/carbon-server:$(B_VER) .

push:
	sudo docker push kyoheiudev/carbon-client:$(F_VER)
	sudo docker push kyoheiudev/carbon-server:$(B_VER)
