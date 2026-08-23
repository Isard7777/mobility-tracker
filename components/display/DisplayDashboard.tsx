"use client";

import { useEffect, useState } from "react";
import { CO2Counter } from "@/components/display/CO2Counter";
import { EquivalentsRotator } from "@/components/display/EquivalentsRotator";
import { GrowingTree } from "@/components/display/GrowingTree";
import { IconRain } from "@/components/display/IconRain";
import { RecentFeed } from "@/components/display/RecentFeed";
import { TREE_GROWTH } from "@/config/display";
import type { ModeId } from "@/config/modes";
import { estimateCo2SavedKg } from "@/lib/co2";
import type { StreamEntry } from "@/lib/sse";
import type { Totals } from "@/lib/totals";

type DisplayDashboardProps = {
    initialTotals: Totals;
    initialEntries: StreamEntry[];
    demo: boolean;
};

const DEMO_MODES: ModeId[] = ["bike", "walk", "bus", "train", "tram", "ebike", "carpool"];

function demoEntry(sequence: number): StreamEntry {
    const mode = DEMO_MODES[sequence % DEMO_MODES.length];
    const km = TREE_GROWTH.maxKm / TREE_GROWTH.steps;
    const co2SavedKg = estimateCo2SavedKg(mode, km, mode === "carpool" ? 2 : undefined);
    return {
        id: `demo-${sequence}`,
        quadrigram: "DEMO",
        personName: "Mobility team",
        mode,
        km,
        co2SavedKg,
        entryDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
    };
}

export function DisplayDashboard({ initialTotals, initialEntries, demo }: DisplayDashboardProps) {
    const [totals, setTotals] = useState(initialTotals);
    const [recentEntries, setRecentEntries] = useState(initialEntries);
    const [lastEntry, setLastEntry] = useState<StreamEntry | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (demo) {
            let sequence = 0;
            const interval = setInterval(() => {
                const entry = demoEntry(sequence++);
                setLastEntry(entry);
                setRecentEntries((entries) => [entry, ...entries].slice(0, 5));
                setTotals((current) => ({
                    ...current,
                    totalKm: current.totalKm + entry.km,
                    totalCo2SavedKg: Number((current.totalCo2SavedKg + entry.co2SavedKg).toFixed(3)),
                    participantsCount: current.participantsCount + (sequence === 1 ? 1 : 0),
                }));
            }, 3_000);
            return () => clearInterval(interval);
        }

        const applyTotals = (event: MessageEvent<string>) => {
            try {
                const payload = JSON.parse(event.data) as { entry?: StreamEntry; totals: Totals };
                setTotals(payload.totals);
                if (payload.entry) {
                    setLastEntry(payload.entry);
                    setRecentEntries((entries) =>
                        [payload.entry!, ...entries.filter((item) => item.id !== payload.entry!.id)].slice(0, 5)
                    );
                }
            } catch {
                // Ignore malformed stream messages and wait for the next update.
            }
        };

        let stream: EventSource | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let reconnectAttempts = 0;
        let isClosed = false;

        const connect = () => {
            stream = new EventSource("/api/stream");
            stream.addEventListener("totals", applyTotals);
            stream.addEventListener("update", applyTotals);
            stream.onopen = () => {
                reconnectAttempts = 0;
                setIsConnected(true);
            };
            stream.onerror = () => {
                stream?.close();
                setIsConnected(false);
                if (isClosed) return;

                const delay = Math.min(1_000 * 2 ** reconnectAttempts, 30_000);
                reconnectAttempts += 1;
                reconnectTimer = setTimeout(connect, delay);
            };
        };

        connect();
        return () => {
            isClosed = true;
            if (reconnectTimer) clearTimeout(reconnectTimer);
            stream?.close();
        };
    }, [demo]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (new Date().getHours() === 4) location.reload();
        }, 10 * 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative grid h-dvh w-dvw grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] grid-rows-[100px_minmax(0,1fr)_130px] overflow-hidden bg-[#072b25] text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/designtek-waterfall-4726196.jpg')" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(5,46,39,0.48),rgba(3,25,22,0.9))]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_15%,rgba(190,242,100,0.16),transparent_33%),linear-gradient(180deg,rgba(5,46,39,0.12),rgba(5,46,39,0.35))]"
            />

            <header className="relative z-10 col-span-2 row-start-1 flex items-center justify-between px-12 pt-4">
                <p className="text-xl font-semibold tracking-[0.18em] text-lime-200 uppercase">Mobility week</p>
                <div className="flex items-center gap-3 text-sm font-medium text-emerald-100/80">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${isConnected || demo ? "bg-lime-300" : "bg-amber-300"}`}
                    />
                    {demo ? "Demo mode" : isConnected ? "Live" : "Reconnecting"}
                </div>
            </header>

            <section className="relative z-10 col-start-1 row-start-2 flex min-h-0 items-center justify-center px-12 pb-6">
                <IconRain entry={lastEntry} />
                <GrowingTree
                    totalKm={totals.totalKm}
                    pulseKey={lastEntry?.id ?? "initial"}
                />
            </section>

            <aside className="relative z-10 col-start-2 row-start-2 grid min-h-0 grid-rows-[auto_1px_96px_1px_minmax(0,1fr)] gap-y-6 overflow-hidden border-l border-white/15 px-12 py-4">
                <CO2Counter value={totals.totalCo2SavedKg} />
                <div className="h-px bg-white/15" />
                <EquivalentsRotator co2SavedKg={totals.totalCo2SavedKg} />
                <div className="h-px bg-white/15" />
                <div className="min-h-0 overflow-hidden">
                    <RecentFeed entries={recentEntries} />
                </div>
            </aside>

            <footer className="relative z-10 col-span-2 row-start-3 flex items-end justify-between px-12 pb-10">
                <p className="text-5xl font-bold tracking-tight text-white tabular-nums">
                    {totals.totalKm.toFixed(0)}{" "}
                    <span className="text-2xl font-medium text-emerald-100">km together</span>
                </p>
                <p className="text-xl font-medium text-emerald-100/85">
                    {totals.participantsCount} people moving together
                </p>
            </footer>
        </main>
    );
}
