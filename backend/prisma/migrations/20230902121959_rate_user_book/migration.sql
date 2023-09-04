/*
  Warnings:

  - You are about to drop the column `averageRating` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `ratingsCount` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "averageRating",
DROP COLUMN "ratingsCount";

-- CreateTable
CREATE TABLE "RatingUserBook" (
    "rating" DECIMAL(2,1) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "RatingUserBook_pkey" PRIMARY KEY ("userId","bookId")
);

-- AddForeignKey
ALTER TABLE "RatingUserBook" ADD CONSTRAINT "RatingUserBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingUserBook" ADD CONSTRAINT "RatingUserBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
