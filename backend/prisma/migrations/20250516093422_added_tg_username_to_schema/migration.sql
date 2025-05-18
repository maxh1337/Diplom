/*
  Warnings:

  - A unique constraint covering the columns `[telegram_username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telegram_username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telegram_username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_username_key" ON "users"("telegram_username");
