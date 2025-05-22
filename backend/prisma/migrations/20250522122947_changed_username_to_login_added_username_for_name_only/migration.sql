/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "admins_username_key";

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "login" TEXT NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_login_key" ON "admins"("login");
