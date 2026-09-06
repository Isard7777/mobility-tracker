"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Beef, Car, Plane, ShowerHead, Smartphone, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import { getEquivalents } from "@/lib/equivalents";

type EquivalentsRotatorProps = {
    co2SavedKg: number;
};

export function EquivalentsRotator({ co2SavedKg }: EquivalentsRotatorProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const equivalents = getEquivalents(co2SavedKg);
    const items = [
        {
            icon: TreePine,
            value: equivalents.treeYears,
            label: "tree-years of CO2 absorption",
        },
        {
            icon: Car,
            value: equivalents.liegeBrusselsCarRoundTrips,
            label: "Liege-Brussels car round trips",
        },
        {
            icon: Plane,
            value: equivalents.flightHours,
            label: "hours of flying",
        },
        {
            icon: Smartphone,
            value: equivalents.smartphoneChargeYears,
            label: "smartphone charging years",
        },
        {
            icon: ShowerHead,
            value: equivalents.hotShowers,
            label: "hot showers",
        },
        {
            icon: Beef,
            value: equivalents.beefSteaks,
            label: "beef steaks",
        },
        {
            icon: Car,
            value: equivalents.liegeParisCarRoundTrips,
            label: "Liege-Paris car round trips",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => setActiveIndex((index) => (index + 1) % items.length), 8_000);
        return () => clearInterval(interval);
    }, [items.length]);

    const activeItem = items[activeIndex];
    const Icon = activeItem.icon;

    return (
        <section className="h-24 text-center text-white">
            <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">Shared impact</p>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeItem.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45 }}
                    className="flex items-center justify-center gap-3"
                >
                    <Icon
                        size={28}
                        className="text-lime-300"
                        aria-hidden="true"
                    />
                    <p className="text-xl font-semibold">
                        <span className="text-3xl text-lime-200">{activeItem.value}</span> {activeItem.label}
                    </p>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
