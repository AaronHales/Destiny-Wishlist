-- AlterTable
ALTER TABLE "BaseStats" ALTER COLUMN "weaponId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DamageType" ALTER COLUMN "weaponId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EquipmentSlot" ALTER COLUMN "weaponId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Socket" ALTER COLUMN "weaponId" DROP NOT NULL;
