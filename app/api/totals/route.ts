import { NextResponse } from "next/server";
import { showIndividualWeeklyCo2 } from "@/lib/feature-flags";
import { getTotals } from "@/lib/totals";

export async function GET(request: Request) {
    const includeIndividualWeeklyCo2 =
        showIndividualWeeklyCo2 && new URL(request.url).searchParams.get("includeIndividualWeeklyCo2") === "true";
    return NextResponse.json(await getTotals({ includeIndividualWeeklyCo2 }));
}
