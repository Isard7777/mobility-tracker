import { KioskFlow } from "@/components/kiosk/KioskFlow";
import { showIndividualWeeklyCo2 } from "@/lib/feature-flags";
import { getTotals } from "@/lib/totals";

// Totals must be read fresh on every load, never prerendered/cached at build time.
export const dynamic = "force-dynamic";

export default async function KioskPage() {
    const totals = await getTotals({ includeIndividualWeeklyCo2: showIndividualWeeklyCo2 });
    return (
        <KioskFlow
            initialTotals={totals}
            showIndividualWeeklyCo2={showIndividualWeeklyCo2}
        />
    );
}
