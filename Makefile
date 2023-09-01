fe:
	CARBON_GIT_SERVER=127.0.0.1 npm run dev

be:
	cd axum && RUST_LOG=debug cargo run

build:
	sudo docker build --tag=kyoheiudev/carbon:$(VER) .

push:
	sudo docker push kyoheiudev/carbon:$(VER)
