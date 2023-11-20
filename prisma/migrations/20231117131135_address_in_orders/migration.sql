/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addressId" INTEGER NOT NULL, ADD COLUMN "receiptUrl" TEXT, ADD COLUMN "total" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
