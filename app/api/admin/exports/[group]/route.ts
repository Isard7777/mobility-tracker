import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { csvResponse, getExportCsv, isExportGroup } from "@/lib/admin-exports";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ExportRouteContext = {
    params: Promise<{ group: string }>;
};

export async function GET(request: Request, { params }: ExportRouteContext) {
    if (!isAdminAuthorized(request.headers.get("authorization"), process.env.ADMIN_PASSWORD)) {
        return adminUnauthorizedResponse();
    }

    const { group } = await params;
    if (!isExportGroup(group)) {
        return NextResponse.json({ error: "Unknown export group" }, { status: 404 });
    }

    return csvResponse(await getExportCsv(group), group);
}
