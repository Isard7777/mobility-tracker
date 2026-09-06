import { prisma } from "./db";

export const EXPORT_GROUPS = ["date", "user", "mode", "entries"] as const;
export type ExportGroup = (typeof EXPORT_GROUPS)[number];

const CSV_MIME_TYPE = "text/csv; charset=utf-8";

function escapeCsv(value: string | number): string {
    const stringValue = String(value);
    return /[";\n\r]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
}

function csv(headers: string[], rows: Array<Array<string | number>>): string {
    return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n")}\r\n`;
}

export async function getExportCsv(group: ExportGroup): Promise<string> {
    switch (group) {
        case "date": {
            const entries = await prisma.entry.groupBy({
                by: ["entryDate"],
                _count: { _all: true },
                _sum: { km: true, co2SavedKg: true },
                orderBy: { entryDate: "asc" },
            });
            return csv(
                ["date", "journeys", "total_km", "co2_saved_kg"],
                entries.map((entry) => [
                    entry.entryDate.toISOString().slice(0, 10),
                    entry._count._all,
                    Number(entry._sum.km ?? 0).toFixed(2),
                    Number(entry._sum.co2SavedKg ?? 0).toFixed(3),
                ])
            );
        }
        case "user": {
            const entries = await prisma.entry.groupBy({
                by: ["quadrigram", "personName"],
                _count: { _all: true },
                _sum: { km: true, co2SavedKg: true },
                orderBy: { personName: "asc" },
            });
            return csv(
                ["quadrigram", "person_name", "journeys", "total_km", "co2_saved_kg"],
                entries.map((entry) => [
                    entry.quadrigram,
                    entry.personName,
                    entry._count._all,
                    Number(entry._sum.km ?? 0).toFixed(2),
                    Number(entry._sum.co2SavedKg ?? 0).toFixed(3),
                ])
            );
        }
        case "mode": {
            const entries = await prisma.entry.groupBy({
                by: ["mode"],
                _count: { _all: true },
                _sum: { km: true, co2SavedKg: true },
                orderBy: { mode: "asc" },
            });
            return csv(
                ["transport_mode", "journeys", "total_km", "co2_saved_kg"],
                entries.map((entry) => [
                    entry.mode,
                    entry._count._all,
                    Number(entry._sum.km ?? 0).toFixed(2),
                    Number(entry._sum.co2SavedKg ?? 0).toFixed(3),
                ])
            );
        }
        case "entries": {
            const entries = await prisma.entry.findMany({
                select: {
                    id: true,
                    entryDate: true,
                    quadrigram: true,
                    personName: true,
                    team: true,
                    mode: true,
                    km: true,
                    carpoolOccupants: true,
                    co2SavedKg: true,
                    createdAt: true,
                    source: true,
                },
                orderBy: [{ entryDate: "asc" }, { createdAt: "asc" }],
            });
            return csv(
                [
                    "id",
                    "date",
                    "participant",
                    "quadrigram",
                    "team",
                    "transport_mode",
                    "round_trip_km",
                    "carpool_occupants",
                    "co2_saved_kg",
                    "created_at",
                    "source",
                ],
                entries.map((entry) => [
                    entry.id.toString(),
                    entry.entryDate.toISOString().slice(0, 10),
                    entry.personName,
                    entry.quadrigram,
                    entry.team ?? "",
                    entry.mode,
                    Number(entry.km).toFixed(2),
                    entry.carpoolOccupants ?? "",
                    Number(entry.co2SavedKg).toFixed(3),
                    entry.createdAt.toISOString(),
                    entry.source,
                ])
            );
        }
    }
}

export function isExportGroup(value: string): value is ExportGroup {
    return EXPORT_GROUPS.includes(value as ExportGroup);
}

export function csvResponse(content: string, group: ExportGroup): Response {
    const filename = `mobility-tracker-by-${group}.csv`;
    return new Response(content, {
        headers: {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": CSV_MIME_TYPE,
            "Cache-Control": "no-store",
        },
    });
}
