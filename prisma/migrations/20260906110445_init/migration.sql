-- CreateTable
CREATE TABLE "entries" (
    "id" BIGSERIAL NOT NULL,
    "quadrigram" TEXT NOT NULL,
    "person_name" TEXT NOT NULL,
    "team" TEXT,
    "mode" TEXT NOT NULL,
    "km" DECIMAL(10,2) NOT NULL,
    "carpool_occupants" INTEGER,
    "co2_saved_kg" DECIMAL(8,3) NOT NULL,
    "entry_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'web',

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "quadrigram" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("quadrigram")
);

-- CreateIndex
CREATE INDEX "idx_entries_created_at" ON "entries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_entries_team" ON "entries"("team");

-- Insert default participant
INSERT INTO "participants" ("quadrigram", "display_name", "updated_at") VALUES
    ('ADUP', 'Alice Dupont', CURRENT_TIMESTAMP),
    ('BLEF', 'Benoit Lefevre', CURRENT_TIMESTAMP),
    ('CMAR', 'Chloe Martin', CURRENT_TIMESTAMP),
    ('DBER', 'David Bernard', CURRENT_TIMESTAMP),
    ('EROU', 'Emma Roux', CURRENT_TIMESTAMP),
    ('FPET', 'Fabien Petit', CURRENT_TIMESTAMP),
    ('GMOR', 'Gaelle Moreau', CURRENT_TIMESTAMP),
    ('HSIM', 'Hugo Simon', CURRENT_TIMESTAMP);
