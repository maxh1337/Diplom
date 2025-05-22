# Dockerfile для backend
FROM node:23.11.1-alpine

WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Устанавливаем dotenv-cli глобально
RUN yarn global add dotenv-cli

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
