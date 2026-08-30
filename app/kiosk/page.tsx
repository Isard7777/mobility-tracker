import { KioskFlow } from "@/components/kiosk/KioskFlow";
import { getTotals } from "@/lib/totals";

// Totals must be read fresh on every load, never prerendered/cached at build time.
export const dynamic = "force-dynamic";

export default async function KioskPage() {
  const totals = await getTotals();
  return <KioskFlow initialTotals={totals} />;
}

