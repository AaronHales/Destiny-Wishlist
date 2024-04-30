/*
  Warnings:

  - Made the column `weaponId` on table `BaseStats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weaponId` on table `EquipmentSlot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weaponId` on table `Socket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `baseStatsId` on table `Stat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BaseStats" ALTER COLUMN "weaponId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EquipmentSlot" ALTER COLUMN "weaponId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Socket" ALTER COLUMN "weaponId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stat" ALTER COLUMN "baseStatsId" SET NOT NULL;
