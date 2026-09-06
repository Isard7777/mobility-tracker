"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Leaf } from "lucide-react";
import { useEffect } from "react";

type CO2CounterProps = {
    value: number;
};

export function CO2Counter({ value }: CO2CounterProps) {
    const count = useMotionValue(value);
    const displayValue = useTransform(count, (latest) => `${latest.toFixed(1)} kg`);

    useEffect(() => {
        const controls = animate(count, value, { duration: 1.2, ease: "easeOut" });
        return controls.stop;
    }, [count, value]);

    return (
        <section className="flex flex-col items-center text-center text-white">
            <div className="mb-3 flex items-center gap-3 text-lg font-semibold tracking-[0.12em] text-lime-200 uppercase">
                <Leaf
                    size={24}
                    aria-hidden="true"
                />
                CO2 saved together
            </div>
            <motion.p className="text-6xl font-bold tracking-tight text-white tabular-nums xl:text-8xl">
                {displayValue}
            </motion.p>
            <p className="mt-2 text-xs text-emerald-100/80">ADEME / Impact CO2 lifecycle factors</p>
        </section>
    );
}
