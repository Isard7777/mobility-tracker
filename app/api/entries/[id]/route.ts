import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { estimateCo2SavedKg } from "@/lib/co2";
import { publishEntry } from "@/lib/sse";
import { updateEntrySchema } from "@/lib/validation";
import { ENTRY_EDIT_WINDOW_MS } from "@/config/entries";
import type { ModeId } from "@/config/modes";

type EntryRouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: EntryRouteContext) {
    const { id } = await params;
    let entryId: bigint;
    try {
        entryId = BigInt(id);
    } catch {
        return NextResponse.json({ error: "Invalid entry id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateEntrySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
    }

    const existing = await prisma.entry.findUnique({ where: { id: entryId } });
    if (!existing) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (Date.now() - existing.createdAt.getTime() > ENTRY_EDIT_WINDOW_MS) {
        return NextResponse.json({ error: "This entry can no longer be corrected" }, { status: 410 });
    }

    const { mode, oneWayKm, carpoolOccupants } = parsed.data;
    const km = oneWayKm * 2;
    const co2SavedKg = estimateCo2SavedKg(mode as ModeId, km, carpoolOccupants);

    const entry = await prisma.entry.update({
        where: { id: entryId },
        data: { mode, km, carpoolOccupants: carpoolOccupants ?? null, co2SavedKg },
    });

    const response = {
        id: entry.id.toString(),
        quadrigram: entry.quadrigram,
        personName: entry.personName,
        mode: entry.mode as ModeId,
        km: Number(entry.km),
        entryDate: entry.entryDate.toISOString().slice(0, 10),
        co2SavedKg: Number(entry.co2SavedKg),
        createdAt: entry.createdAt.toISOString(),
    };
    publishEntry(response);

    return NextResponse.json(response);
}
