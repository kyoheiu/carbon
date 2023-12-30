FROM node:slim AS frontend-builder
WORKDIR /frontend-builder
COPY ./client .
RUN npm install && npm run build

FROM rust:1-alpine3.18 as backend-builder
WORKDIR /backend-builder
COPY ./server .
RUN apk update && apk add --no-cache musl-dev
RUN cargo build --release --locked

# stage run
FROM alpine:3.18.3
WORKDIR /carbon
RUN apk add --no-cache fd ripgrep
COPY --from=frontend-builder /frontend-builder/dist .
COPY --from=backend-builder /backend-builder/target/release/carbon .
ENV RUST_LOG info
EXPOSE 3000
CMD ["carbon"]