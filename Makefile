dev:
	cd client && npm run build && rm -rf ../server/static/* && cp -r ./dist/* ../server/static
	cd server && RUST_LOG=debug cargo run

build:
	sudo docker build --tag=kyoheiudev/carbon:$(VER) .

push:
	sudo docker push kyoheiudev/carbon:$(VER)
