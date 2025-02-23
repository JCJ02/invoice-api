-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "nextInvoiceDate" TIMESTAMP(3),
ADD COLUMN     "recurringInterval" TEXT,
ALTER COLUMN "isDraft" DROP NOT NULL,
ALTER COLUMN "isRecurring" DROP NOT NULL;
