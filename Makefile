fmt:
	npm run format && npm run lint
	cd axum && cargo fmt

fe:
	npm run dev

be:
	cd axum && RUST_LOG=debug cargo run

build:
	sudo docker build --tag=kyoheiudev/carbon-client:$(VER) .
	cd axum && sudo docker build --tag=kyoheiudev/carbon-server:$(VER) .

push:
	sudo docker push kyoheiudev/carbon-client:$(VER)
	sudo docker push kyoheiudev/carbon-server:$(VER)
