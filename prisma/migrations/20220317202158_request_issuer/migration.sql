/*
  Warnings:

  - Added the required column `issuer` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Request` ADD COLUMN `issuer` VARCHAR(191) NOT NULL;
