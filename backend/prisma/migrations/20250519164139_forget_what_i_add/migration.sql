/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_administrator_id_fkey";

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rights" "AdminRole"[] DEFAULT ARRAY['PART']::"AdminRole"[],

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_administrator_id_fkey" FOREIGN KEY ("administrator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
