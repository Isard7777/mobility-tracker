import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { parseParticipantCsv } from "@/lib/participant-import";
import { getParticipants } from "@/lib/participants";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
    if (!isAdminAuthorized(request.headers.get("authorization"), process.env.ADMIN_PASSWORD)) {
        return adminUnauthorizedResponse();
    }

    return NextResponse.json(await getParticipants());
}

export async function PUT(request: Request) {
    if (!isAdminAuthorized(request.headers.get("authorization"), process.env.ADMIN_PASSWORD)) {
        return adminUnauthorizedResponse();
    }

    const parsed = parseParticipantCsv(await request.text());
    if (parsed.errors.length > 0) {
        return NextResponse.json({ errors: parsed.errors }, { status: 400 });
    }

    await prisma.$transaction([
        prisma.participant.deleteMany(),
        prisma.participant.createMany({ data: parsed.participants }),
    ]);

    return NextResponse.json({ participants: parsed.participants });
}
