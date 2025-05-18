/*
  Warnings:

  - You are about to drop the column `telegramSecondName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "telegramSecondName",
ADD COLUMN     "telegramLastName" TEXT;
