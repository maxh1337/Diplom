/*
  Warnings:

  - You are about to drop the column `ends_at` on the `Event` table. All the data in the column will be lost.
  - Added the required column `event_date` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_time` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "ends_at",
ADD COLUMN     "event_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "event_time" TEXT NOT NULL;
