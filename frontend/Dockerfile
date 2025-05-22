# Build stage
FROM node:23.11.1-alpine AS builder
WORKDIR /app

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

# Set a build-time environment variable
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

# Production stage
FROM node:23.11.1-alpine
WORKDIR /app

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "start"]
