import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { PARTICIPANTS } from "@/config/participants";
import { estimateCo2SavedKg } from "@/lib/co2";
import { createEntrySchema } from "@/lib/validation";
import type { ModeId } from "@/config/modes";

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: z.treeifyError(parsed.error) },
            { status: 400 },
        );
    }

    const { quadrigram, mode, km, source } = parsed.data;
    const participant = PARTICIPANTS.find(
        (p) => p.quadrigram.toLowerCase() === quadrigram.toLowerCase(),
    );
    if (!participant) {
        return NextResponse.json(
            { error: "Unknown quadrigram" },
            { status: 400 },
        );
    }

    // CO2 is always computed server-side, never trusted from the client.
    const co2SavedKg = estimateCo2SavedKg(mode as ModeId, km);

    const entry = await prisma.entry.create({
        data: {
            quadrigram: participant.quadrigram,
            personName: participant.displayName,
            mode,
            km,
            co2SavedKg,
            source,
        },
    });

    return NextResponse.json(
        {
            id: entry.id.toString(),
            quadrigram: entry.quadrigram,
            personName: entry.personName,
            mode: entry.mode,
            km: Number(entry.km),
            co2SavedKg: Number(entry.co2SavedKg),
            createdAt: entry.createdAt.toISOString(),
        },
        { status: 201 },
    );
}
