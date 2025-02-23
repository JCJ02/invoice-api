/*
  Warnings:

  - You are about to drop the column `nextInvoiceDate` on the `Invoices` table. All the data in the column will be lost.
  - You are about to drop the column `recurringInterval` on the `Invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "nextInvoiceDate",
DROP COLUMN "recurringInterval";
