import { prisma } from "./db";

export type Totals = {
    totalKm: number;
    totalCo2SavedKg: number;
    participantsCount: number;
    byMode: { mode: string; km: number; co2SavedKg: number }[];
    weeklyCo2ByQuadrigram?: Record<string, number>;
};

type GetTotalsOptions = {
    includeIndividualWeeklyCo2?: boolean;
};

export function getCurrentWeekRange(now = new Date()): { start: Date; end: Date } {
    const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const day = start.getUTCDay() || 7;
    start.setUTCDate(start.getUTCDate() - day + 1);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return { start, end };
}

export async function getTotals({ includeIndividualWeeklyCo2 = false }: GetTotalsOptions = {}): Promise<Totals> {
    const [totals, byMode, distinctParticipants] = await Promise.all([
        prisma.entry.aggregate({ _sum: { km: true, co2SavedKg: true } }),
        prisma.entry.groupBy({
            by: ["mode"],
            _sum: { km: true, co2SavedKg: true },
        }),
        prisma.entry.findMany({
            distinct: ["quadrigram"],
            select: { quadrigram: true },
        }),
    ]);

    const weeklyCo2ByQuadrigram = includeIndividualWeeklyCo2
        ? Object.fromEntries(
              (
                  await prisma.entry.groupBy({
                      by: ["quadrigram"],
                      where: { entryDate: { gte: getCurrentWeekRange().start, lt: getCurrentWeekRange().end } },
                      _sum: { co2SavedKg: true },
                  })
              ).map((entry) => [entry.quadrigram, Number(entry._sum.co2SavedKg ?? 0)])
          )
        : undefined;

    return {
        totalKm: Number(totals._sum.km ?? 0),
        totalCo2SavedKg: Number(totals._sum.co2SavedKg ?? 0),
        participantsCount: distinctParticipants.length,
        byMode: byMode.map((entry) => ({
            mode: entry.mode,
            km: Number(entry._sum.km ?? 0),
            co2SavedKg: Number(entry._sum.co2SavedKg ?? 0),
        })),
        ...(weeklyCo2ByQuadrigram ? { weeklyCo2ByQuadrigram } : {}),
    };
}
