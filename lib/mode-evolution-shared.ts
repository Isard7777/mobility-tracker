import { MODES, type ModeId } from "@/config/modes";

export type ModeEvolutionSeries = {
    mode: ModeId;
    cumulativeCo2SavedKg: number[];
    totalCo2SavedKg: number;
};

export type ModeEvolution = {
    dates: string[];
    series: ModeEvolutionSeries[];
};

export function emptyModeEvolution(): ModeEvolution {
    return {
        dates: [],
        series: MODES.map((mode) => ({ mode: mode.id, cumulativeCo2SavedKg: [], totalCo2SavedKg: 0 })),
    };
}

type ModeEvolutionEntryLike = {
    mode: ModeId;
    co2SavedKg: number;
    entryDate: string;
};

// Pure so it can run both server-side (seeding from the DB) and client-side
// (folding in a live demo tick or SSE update) without re-fetching history.
export function applyEntryToModeEvolution(current: ModeEvolution, entry: ModeEvolutionEntryLike): ModeEvolution {
    const dateKey = entry.entryDate.slice(0, 10);
    const lastDateKey = current.dates.at(-1);

    if (lastDateKey === dateKey) {
        return {
            dates: current.dates,
            series: current.series.map((series) =>
                series.mode === entry.mode
                    ? {
                          ...series,
                          cumulativeCo2SavedKg: series.cumulativeCo2SavedKg.map((value, index) =>
                              index === series.cumulativeCo2SavedKg.length - 1 ? value + entry.co2SavedKg : value
                          ),
                          totalCo2SavedKg: series.totalCo2SavedKg + entry.co2SavedKg,
                      }
                    : series
            ),
        };
    }

    return {
        dates: [...current.dates, dateKey],
        series: current.series.map((series) => {
            const bump = series.mode === entry.mode ? entry.co2SavedKg : 0;
            const total = series.totalCo2SavedKg + bump;
            return {
                ...series,
                cumulativeCo2SavedKg: [...series.cumulativeCo2SavedKg, total],
                totalCo2SavedKg: total,
            };
        }),
    };
}
