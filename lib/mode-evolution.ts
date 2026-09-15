import { MODES } from "@/config/modes";
import { prisma } from "./db";
import { emptyModeEvolution, type ModeEvolution } from "./mode-evolution-shared";

export async function getModeEvolution(): Promise<ModeEvolution> {
    const rows = await prisma.entry.groupBy({
        by: ["entryDate", "mode"],
        _sum: { co2SavedKg: true },
        orderBy: { entryDate: "asc" },
    });

    if (rows.length === 0) return emptyModeEvolution();

    const dateKeys = Array.from(new Set(rows.map((row) => row.entryDate.toISOString().slice(0, 10)))).sort();

    const co2ByModeAndDate = new Map<string, Map<string, number>>();
    for (const row of rows) {
        const dateKey = row.entryDate.toISOString().slice(0, 10);
        const byDate = co2ByModeAndDate.get(row.mode) ?? new Map<string, number>();
        byDate.set(dateKey, Number(row._sum.co2SavedKg ?? 0));
        co2ByModeAndDate.set(row.mode, byDate);
    }

    const series = MODES.map((mode) => {
        const byDate = co2ByModeAndDate.get(mode.id);
        let running = 0;
        const cumulativeCo2SavedKg = dateKeys.map((dateKey) => {
            running += byDate?.get(dateKey) ?? 0;
            return Number(running.toFixed(3));
        });
        return { mode: mode.id, cumulativeCo2SavedKg, totalCo2SavedKg: cumulativeCo2SavedKg.at(-1) ?? 0 };
    });

    return { dates: dateKeys, series };
}
