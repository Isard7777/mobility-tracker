-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "carpool_occupants" INTEGER,
ADD COLUMN     "entry_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;
