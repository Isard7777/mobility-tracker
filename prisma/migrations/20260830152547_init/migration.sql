-- CreateTable
CREATE TABLE "entries" (
    "id" BIGSERIAL NOT NULL,
    "quadrigram" TEXT NOT NULL,
    "person_name" TEXT NOT NULL,
    "team" TEXT,
    "mode" TEXT NOT NULL,
    "km" DECIMAL(6,2) NOT NULL,
    "co2_saved_kg" DECIMAL(8,3) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'web',

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_entries_created_at" ON "entries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_entries_team" ON "entries"("team");
