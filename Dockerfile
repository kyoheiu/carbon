FROM node:alpine3.18

WORKDIR /carbon-client

COPY . .

RUN apk add --no-cache fd ripgrep
RUN npm ci
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "build/index.js"]
