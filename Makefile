dev:
	cd client && npm i && npm run build && rm -rf ../server/static && mkdir ../server/static && cp -r ./dist/* ../server/static
	cd server && RUST_LOG=debug CARBON_GIT=on cargo run

build:
	cd client && npm install --package-lock-only
	cd server && cargo generate-lockfile
	sudo docker build --tag=kyoheiudev/carbon:$(VER) .

push:
	sudo docker push kyoheiudev/carbon:$(VER)
