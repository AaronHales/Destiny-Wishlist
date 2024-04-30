/*
  Warnings:

  - You are about to drop the column `weaponId` on the `wishListWeapon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wishListWeaponId]` on the table `Weapon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `wishListWeapon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WishList" DROP CONSTRAINT "WishList_userId_fkey";

-- DropForeignKey
ALTER TABLE "wishListWeapon" DROP CONSTRAINT "wishListWeapon_weaponId_fkey";

-- AlterTable
ALTER TABLE "Weapon" ADD COLUMN     "wishListWeaponId" INTEGER;

-- AlterTable
ALTER TABLE "wishListWeapon" DROP COLUMN "weaponId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_wishListWeaponId_key" ON "Weapon"("wishListWeaponId");

-- AddForeignKey
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_wishListWeaponId_fkey" FOREIGN KEY ("wishListWeaponId") REFERENCES "wishListWeapon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
