"use client";

import { motion } from "framer-motion";
import { Leaf, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { MODES } from "@/config/modes";
import type { Totals } from "@/lib/totals";

type DesktopDashboardProps = {
    initialTotals: Totals;
};

export function DesktopDashboard({ initialTotals }: DesktopDashboardProps) {
    const [totals, setTotals] = useState(initialTotals);

    useEffect(() => {
        const stream = new EventSource("/api/stream");
        const updateTotals = (event: MessageEvent<string>) => {
            try {
                const payload = JSON.parse(event.data) as { totals: Totals };
                setTotals(payload.totals);
            } catch {
                // Ignore malformed stream messages and wait for the next update.
            }
        };

        stream.addEventListener("totals", updateTotals);
        stream.addEventListener("update", updateTotals);
        return () => stream.close();
    }, []);

    return (
        <aside className="relative overflow-hidden border-l border-emerald-100 bg-emerald-950 text-white">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
                style={{ backgroundImage: "url('/images/alexas_fotos-hedgehog-3703244.jpg')" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-emerald-950/80"
            />
            <div className="relative px-8 py-10 xl:px-12">
                <p className="text-sm font-semibold tracking-[0.16em] text-lime-300 uppercase">Shared impact</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="border border-white/15 bg-white/8 p-5">
                        <p className="text-3xl font-bold tabular-nums">{totals.totalKm.toFixed(0)}</p>
                        <p className="mt-1 text-sm text-emerald-100/75">km together</p>
                    </div>
                    <div className="border border-white/15 bg-white/8 p-5">
                        <p className="flex items-center gap-2 text-3xl font-bold tabular-nums">
                            <Leaf
                                aria-hidden="true"
                                size={24}
                                className="text-lime-300"
                            />
                            {totals.totalCo2SavedKg.toFixed(1)}
                        </p>
                        <p className="mt-1 text-sm text-emerald-100/75">kg CO2 saved</p>
                    </div>
                </div>

                <div className="mt-10 flex items-center gap-2 text-emerald-100">
                    <Users
                        aria-hidden="true"
                        size={20}
                    />
                    <p className="font-semibold">{totals.participantsCount} people participating</p>
                </div>

                <section className="mt-12">
                    <p className="text-sm font-semibold tracking-[0.16em] text-lime-300 uppercase">By transport mode</p>
                    <div className="mt-5 space-y-4">
                        {[...totals.byMode]
                            .sort((first, second) => second.km - first.km)
                            .map((item) => {
                                const mode = MODES.find((candidate) => candidate.id === item.mode);
                                const percent = totals.totalKm > 0 ? (item.km / totals.totalKm) * 100 : 0;
                                return (
                                    <motion.div
                                        key={item.mode}
                                        layout="position"
                                        transition={{ type: "spring", stiffness: 360, damping: 32 }}
                                    >
                                        <div className="mb-1.5 flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-emerald-50">
                                                <span aria-hidden="true">{mode?.emoji ?? "•"}</span>
                                                {mode?.label ?? item.mode}
                                            </span>
                                            <span className="text-emerald-100/75 tabular-nums">
                                                {item.km.toFixed(0)} km
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden bg-white/15">
                                            <div
                                                className="h-full bg-lime-300 transition-[width] duration-700"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        {totals.byMode.length === 0 && <p className="text-emerald-100/70">No journeys recorded yet</p>}
                    </div>
                </section>
            </div>
        </aside>
    );
}
