import { DesktopDashboard } from "@/components/desktop/DesktopDashboard";
import { DesktopEntryForm } from "@/components/desktop/DesktopEntryForm";
import { getTotals } from "@/lib/totals";

export const dynamic = "force-dynamic";

export default async function Home() {
    const totals = await getTotals();

    return (
        <main className="grid min-h-dvh bg-[#f6fbf4] lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
            <DesktopEntryForm />
            <DesktopDashboard initialTotals={totals} />
        </main>
    );
}
