/*
  Warnings:

  - Made the column `issuedDate` on table `Invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "dueDate" TIMESTAMP(3),
ALTER COLUMN "issuedDate" SET NOT NULL,
ALTER COLUMN "issuedDate" SET DEFAULT CURRENT_TIMESTAMP;
