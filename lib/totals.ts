import { prisma } from "./db";

export type Totals = {
  totalKm: number;
  totalCo2SavedKg: number;
  participantsCount: number;
  byMode: { mode: string; km: number; co2SavedKg: number }[];
};

export async function getTotals(): Promise<Totals> {
  const [totals, byMode, distinctParticipants] = await Promise.all([
    prisma.entry.aggregate({ _sum: { km: true, co2SavedKg: true } }),
    prisma.entry.groupBy({
      by: ["mode"],
      _sum: { km: true, co2SavedKg: true },
    }),
    prisma.entry.findMany({ distinct: ["quadrigram"], select: { quadrigram: true } }),
  ]);

  return {
    totalKm: Number(totals._sum.km ?? 0),
    totalCo2SavedKg: Number(totals._sum.co2SavedKg ?? 0),
    participantsCount: distinctParticipants.length,
    byMode: byMode.map((entry) => ({
      mode: entry.mode,
      km: Number(entry._sum.km ?? 0),
      co2SavedKg: Number(entry._sum.co2SavedKg ?? 0),
    })),
  };
}
