FROM rust:1-alpine3.18 as builder
WORKDIR /carbon-builder
COPY . .
RUN cargo build --release --locked

FROM rust:1-alpine3.18
WORKDIR /carbon-server
COPY --from=builder /carbon-builder/target/release/carbon-server . 
ENV RUST_LOG info
EXPOSE 8080
ENTRYPOINT [ "./carbon-server" ]
