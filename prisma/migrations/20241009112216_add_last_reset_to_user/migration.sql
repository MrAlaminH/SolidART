-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
