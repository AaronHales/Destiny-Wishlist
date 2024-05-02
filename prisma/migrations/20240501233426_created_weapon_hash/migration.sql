/*
  Warnings:

  - Added the required column `weaponHash` to the `Weapon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "weaponHash" INTEGER NOT NULL;
