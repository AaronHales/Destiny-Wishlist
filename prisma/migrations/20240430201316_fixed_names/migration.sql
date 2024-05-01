/*
  Warnings:

  - You are about to drop the column `SocektName` on the `Socket` table. All the data in the column will be lost.
  - Added the required column `socketName` to the `Socket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Socket" DROP COLUMN "SocektName",
ADD COLUMN     "socketName" TEXT NOT NULL;
