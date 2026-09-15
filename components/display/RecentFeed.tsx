"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { MODES } from "@/config/modes";
import type { StreamEntry } from "@/lib/sse";

type RecentFeedProps = {
    entries: StreamEntry[];
};

// Matches the `space-y-2` gap below, so a measured row's height includes it.
const ROW_GAP_PX = 8;

function modeEmoji(mode: StreamEntry["mode"]): string {
    return MODES.find((item) => item.id === mode)?.emoji ?? "•";
}

export function RecentFeed({ entries }: RecentFeedProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const firstRowRef = useRef<HTMLDivElement>(null);
    // Start unclipped so the first entry actually renders and can be measured;
    // if we started at entries.length (0 when the feed is empty), no row would
    // ever mount and visibleCount could never be recomputed.
    const [visibleCount, setVisibleCount] = useState(Number.POSITIVE_INFINITY);

    useLayoutEffect(() => {
        const listEl = listRef.current;
        if (!listEl) return;

        function recomputeVisibleCount() {
            const rowHeight = firstRowRef.current?.offsetHeight;
            if (!rowHeight) return;
            const available = listEl!.clientHeight;
            setVisibleCount(Math.max(1, Math.floor(available / (rowHeight + ROW_GAP_PX))));
        }

        recomputeVisibleCount();
        const observer = new ResizeObserver(recomputeVisibleCount);
        observer.observe(listEl);
        return () => observer.disconnect();
    }, [entries.length]);

    const visibleEntries = entries.slice(0, visibleCount);

    return (
        <section className="flex h-full w-full flex-col">
            <p className="mb-4 text-sm font-semibold tracking-[0.16em] text-emerald-200 uppercase">Latest journeys</p>
            <div
                ref={listRef}
                className="min-h-0 flex-1 space-y-2 overflow-hidden"
            >
                <AnimatePresence initial={false}>
                    {visibleEntries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            ref={index === 0 ? firstRowRef : undefined}
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
                            <p className="text-lg font-semibold text-lime-200">
                                {entry.co2SavedKg.toFixed(1)} kg of CO2 saved
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {entries.length === 0 && <p className="text-lg text-emerald-100/70">Waiting for the first journey</p>}
            </div>
        </section>
    );
}
