"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MODES } from "@/config/modes";
import type { StreamEntry } from "@/lib/sse";

type RecentFeedProps = {
    entries: StreamEntry[];
};

function modeEmoji(mode: StreamEntry["mode"]): string {
    return MODES.find((item) => item.id === mode)?.emoji ?? "•";
}

export function RecentFeed({ entries }: RecentFeedProps) {
    return (
        <section className="w-full">
            <p className="mb-4 text-sm font-semibold tracking-[0.16em] text-emerald-200 uppercase">Latest journeys</p>
            <div className="space-y-2">
                <AnimatePresence initial={false}>
                    {entries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            layout="position"
                            initial={{ opacity: 0, x: 32 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -32, transition: { duration: 0.35 } }}
                            transition={{ type: "spring", stiffness: 360, damping: 32 }}
                            className="flex items-center gap-4 border-b border-white/15 pb-2"
                        >
                            <span
                                className="text-3xl"
                                aria-hidden="true"
                            >
                                {modeEmoji(entry.mode)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-lg font-semibold text-white">{entry.personName}</p>
                                <p className="text-sm text-emerald-100/70">{entry.km.toFixed(1)} km round trip</p>
                            </div>
                            <p className="text-lg font-semibold text-lime-200">+{entry.co2SavedKg.toFixed(1)} kg</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {entries.length === 0 && <p className="text-lg text-emerald-100/70">Waiting for the first journey</p>}
            </div>
        </section>
    );
}
