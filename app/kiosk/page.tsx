import { KioskFlow } from "@/components/kiosk/KioskFlow";
import { showIndividualWeeklyCo2 } from "@/lib/feature-flags";
import { getParticipants } from "@/lib/participants";
import { getTotals } from "@/lib/totals";

// Totals must be read fresh on every load, never prerendered/cached at build time.
export const dynamic = "force-dynamic";

export default async function KioskPage() {
    const [totals, participants] = await Promise.all([
        getTotals({ includeIndividualWeeklyCo2: showIndividualWeeklyCo2 }),
        getParticipants(),
    ]);
    return (
        <KioskFlow
            initialTotals={totals}
            participants={participants}
            showIndividualWeeklyCo2={showIndividualWeeklyCo2}
        />
    );
}
