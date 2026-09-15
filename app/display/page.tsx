import { DisplayDashboard } from "@/components/display/DisplayDashboard";
import { getModeEvolution } from "@/lib/mode-evolution";
import { getRecentEntries } from "@/lib/recent-entries";
import { getTotals } from "@/lib/totals";

export const dynamic = "force-dynamic";

type DisplayPageProps = {
    searchParams: Promise<{ demo?: string }>;
};

export default async function DisplayPage({ searchParams }: DisplayPageProps) {
    const { demo } = await searchParams;
    const [totals, entries, modeEvolution] = await Promise.all([getTotals(), getRecentEntries(), getModeEvolution()]);

    return (
        <DisplayDashboard
            initialTotals={totals}
            initialEntries={entries}
            initialModeEvolution={modeEvolution}
            demo={demo === "1"}
        />
    );
}
