# Dockerfile для backend
FROM node:23.11.1-alpine

WORKDIR /app

# Копируем .env.production
COPY .env.production ./

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Устанавливаем dotenvx глобально
RUN yarn global add @dotenvx/dotenvx

# Копируем весь исходный код
COPY . .

# Генерация Prisma
RUN npx prisma generate

# Компилируем приложение
RUN yarn build

# Указываем порт для прослушивания
EXPOSE 4200

# Запускаем приложение
CMD ["yarn", "start:prod"]