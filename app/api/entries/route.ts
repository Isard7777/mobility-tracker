import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { estimateCo2SavedKg } from "@/lib/co2";
import { publishEntry } from "@/lib/sse";
import { createEntrySchema } from "@/lib/validation";
import type { ModeId } from "@/config/modes";

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
    }

    const { quadrigram, mode, oneWayKm, entryDate, carpoolOccupants, source } = parsed.data;
    const participant = await prisma.participant.findUnique({
        where: { quadrigram: quadrigram.toUpperCase() },
    });
    if (!participant) {
        return NextResponse.json({ error: "Unknown quadrigram" }, { status: 400 });
    }

    const km = oneWayKm * 2;
    const co2SavedKg = estimateCo2SavedKg(mode as ModeId, km, carpoolOccupants);
    const selectedEntryDate = entryDate ? new Date(`${entryDate}T00:00:00.000Z`) : new Date();

    const entry = await prisma.entry.create({
        data: {
            quadrigram: participant.quadrigram,
            personName: participant.displayName,
            mode,
            km,
            carpoolOccupants,
            co2SavedKg,
            entryDate: selectedEntryDate,
            source,
        },
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

    return NextResponse.json(response, { status: 201 });
}
