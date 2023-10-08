/*
  Warnings:

  - The primary key for the `CartBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CartBook` table. All the data in the column will be lost.
  - The primary key for the `OrderBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderBook` table. All the data in the column will be lost.
  - The primary key for the `WishlistBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WishlistBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartBook" DROP CONSTRAINT "CartBook_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CartBook_pkey" PRIMARY KEY ("cartId", "bookId");

-- AlterTable
ALTER TABLE "OrderBook" DROP CONSTRAINT "OrderBook_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "OrderBook_pkey" PRIMARY KEY ("orderId", "bookId");

-- AlterTable
ALTER TABLE "WishlistBook" DROP CONSTRAINT "WishlistBook_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "WishlistBook_pkey" PRIMARY KEY ("wishlistId", "bookId");
