-- AlterTable
ALTER TABLE "Invoices" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isDraft" SET DEFAULT false;
