"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Beef, Car, Plane, ShowerHead, Smartphone, Train, TreePine } from "lucide-react";
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
            icon: Car,
            value: equivalents.liegeBrusselsCarRoundTrips,
            label: "Liege-Brussels car round trips",
            assumption: "200 km round trip, average combustion car",
        },
        {
            icon: Train,
            value: equivalents.intercityTrainKm,
            label: "km by intercity train",
            assumption: "ADEME lifecycle factor",
        },
        {
            icon: Plane,
            value: equivalents.shortHaulFlightKm,
            label: "km on a short-haul flight",
            assumption: "ADEME lifecycle factor",
        },
        {
            icon: TreePine,
            value: equivalents.treeYears,
            label: "tree-years of CO2 absorption",
            assumption: "estimate: 25 kg CO2e per tree per year",
        },
        {
            icon: Beef,
            value: equivalents.beefSteaks,
            label: "150 g beef steaks",
            assumption: "Agribalyse estimate: 4.2 kg CO2e per steak",
        },
        {
            icon: ShowerHead,
            value: equivalents.hotShowers,
            label: "5-minute hot showers",
            assumption: "estimate: gas-heated water, 8 L per minute",
        },
        {
            icon: Smartphone,
            value: equivalents.smartphoneChargingYears,
            label: "years of smartphone charging",
            assumption: "estimate: 5 kWh per year, Belgian grid",
        },
        {
            icon: Car,
            value: equivalents.liegeParisCarRoundTrips,
            label: "Liege-Paris car round trips",
            assumption: "600 km round trip, average combustion car",
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
            <p className="mt-1 text-xs text-emerald-100/80">{activeItem.assumption}</p>
        </section>
    );
}
