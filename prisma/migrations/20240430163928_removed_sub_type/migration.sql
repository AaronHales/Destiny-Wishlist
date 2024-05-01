/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Weapon` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Weapon` table. All the data in the column will be lost.
  - You are about to drop the column `weaponSubType` on the `Weapon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Weapon" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "weaponSubType";
