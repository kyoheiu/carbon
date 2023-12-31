FROM node:slim as client-builder
WORKDIR /client-builder
COPY ./client .
RUN npm i && npm run build

FROM rust:1-alpine3.18 as server-builder
WORKDIR /server-builder
COPY ./server .
RUN apk update && apk add --no-cache musl-dev
RUN cargo build --release --locked

FROM alpine:3.18
WORKDIR /carbon
RUN apk update && apk add --no-cache fd ripgrep && mkdir static
COPY --from=server-builder /server-builder/target/release/carbon-server . 
COPY --from=client-builder /client-builder/dist/ ./static/
ENV RUST_LOG info
EXPOSE 3000
ENTRYPOINT [ "./carbon-server" ]
