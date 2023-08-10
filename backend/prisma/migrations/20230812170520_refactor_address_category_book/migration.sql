/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `publishedDate` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN "countryCode" VARCHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE "Book"
ALTER COLUMN "publishedDate" TYPE TIMESTAMP(3) USING "publishedDate"::timestamp(3);

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isBestseller" BOOLEAN NOT NULL DEFAULT false;