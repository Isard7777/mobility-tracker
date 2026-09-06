import { DisplayDashboard } from "@/components/display/DisplayDashboard";
import { getRecentEntries } from "@/lib/recent-entries";
import { getTotals } from "@/lib/totals";

export const dynamic = "force-dynamic";

type DisplayPageProps = {
    searchParams: Promise<{ demo?: string }>;
};

export default async function DisplayPage({ searchParams }: DisplayPageProps) {
    const { demo } = await searchParams;
    const [totals, entries] = await Promise.all([getTotals(), getRecentEntries()]);

    return (
        <DisplayDashboard
            initialTotals={totals}
            initialEntries={entries}
            demo={demo === "1"}
        />
    );
}
