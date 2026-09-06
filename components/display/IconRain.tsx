"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MODES } from "@/config/modes";
import type { StreamEntry } from "@/lib/sse";

type IconRainProps = {
    entry: StreamEntry | null;
};

export function IconRain({ entry }: IconRainProps) {
    const emoji = entry ? MODES.find((mode) => mode.id === entry.mode)?.emoji : null;

    return (
        <AnimatePresence>
            {entry && emoji && (
                <motion.span
                    key={entry.id}
                    aria-hidden="true"
                    initial={{ opacity: 0, x: "-50%", y: -80, scale: 1.5 }}
                    animate={{ opacity: [0, 1, 1, 0], y: ["0vh", "44vh", "61vh", "67vh"], scale: [1.5, 1, 0.5, 0.1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.7, ease: "easeIn" }}
                    className="pointer-events-none absolute top-0 left-1/2 z-20 text-5xl"
                >
                    {emoji}
                </motion.span>
            )}
        </AnimatePresence>
    );
}
