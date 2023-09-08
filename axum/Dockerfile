FROM rust:1-alpine3.18 as builder
WORKDIR /carbon-builder
COPY . .
RUN apk update && apk add --no-cache musl-dev
RUN cargo build --release --locked

FROM alpine:3.18
WORKDIR /carbon-git
COPY --from=builder /carbon-builder/target/release/carbon-git . 
ENV RUST_LOG info
EXPOSE 8080
ENTRYPOINT [ "./carbon-git" ]
