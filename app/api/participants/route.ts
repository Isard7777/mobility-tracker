import { NextResponse } from "next/server";
import { getParticipants } from "@/lib/participants";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json(await getParticipants());
}
