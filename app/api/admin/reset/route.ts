import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const RESET_CONFIRMATION = "DELETE JOURNEYS";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
    if (!isAdminAuthorized(request.headers.get("authorization"), process.env.ADMIN_PASSWORD)) {
        return adminUnauthorizedResponse();
    }

    const body = (await request.json()) as { confirmation?: string };
    if (body.confirmation !== RESET_CONFIRMATION) {
        return NextResponse.json({ error: "Invalid reset confirmation" }, { status: 400 });
    }

    const { count } = await prisma.entry.deleteMany();
    return NextResponse.json({ deletedEntries: count });
}
