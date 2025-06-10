/*
  Warnings:

  - The `skillGaps` column on the `Assessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `resources` on the `Roadmap` table. All the data in the column will be lost.
  - Added the required column `content` to the `Roadmap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Roadmap` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "skillGaps",
ADD COLUMN     "skillGaps" TEXT[];

-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "resources",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
