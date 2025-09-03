/*
  Warnings:

  - You are about to drop the column `path` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key,bucket]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bucket` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."files_path_key";

-- AlterTable
ALTER TABLE "public"."files" DROP COLUMN "path",
ADD COLUMN     "bucket" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_key_bucket_key" ON "public"."files"("key", "bucket");
