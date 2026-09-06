import type { ModeId } from "@/config/modes";
import { prisma } from "./db";
import type { StreamEntry } from "./sse";

const RECENT_ENTRIES_LIMIT = 5;

export async function getRecentEntries(limit = RECENT_ENTRIES_LIMIT): Promise<StreamEntry[]> {
    const entries = await prisma.entry.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });

    return entries.map((entry) => ({
        id: entry.id.toString(),
        quadrigram: entry.quadrigram,
        personName: entry.personName,
        mode: entry.mode as ModeId,
        km: Number(entry.km),
        co2SavedKg: Number(entry.co2SavedKg),
        entryDate: entry.entryDate.toISOString().slice(0, 10),
        createdAt: entry.createdAt.toISOString(),
    }));
}
