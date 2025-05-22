# Build stage
FROM node:23.11.1-alpine AS builder
WORKDIR /app

# Установка pnpm через corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Production stage (если нужно просто запустить dev-сервер)
FROM node:23.11.1-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["pnpm", "preview", "--host", "--port", "5173"]
