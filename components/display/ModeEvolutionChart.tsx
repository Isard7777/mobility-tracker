"use client";

import { MODES } from "@/config/modes";
import type { ModeEvolution } from "@/lib/mode-evolution-shared";

type ModeEvolutionChartProps = {
    data: ModeEvolution;
};

// Validated (dataviz skill) for this kiosk's dark-green surface: 8 hues, fixed
// order, all pass CVD-safe adjacent-pair and contrast checks. Every mode is a
// direct-labeled legend row (emoji + text + value), so identity never rests
// on hue alone — including "green", which would otherwise blend into the
// app's own lime/emerald chrome without that label.
const MODE_COLORS: Record<string, string> = {
    ebike: "#3987e5",
    bike: "#d95926",
    walk: "#199e70",
    bus: "#c98500",
    train: "#d55181",
    escooter: "#008300",
    tram: "#9085e9",
    carpool: "#e66767",
};

const CHART_WIDTH = 400;
const CHART_HEIGHT = 96;

function buildPath(values: number[], maxValue: number): string {
    if (values.length === 0) return "";

    // A single day has nothing to draw a line between yet: show it as a flat
    // line across the full width instead of an invisible single-point path.
    if (values.length === 1) {
        const y = CHART_HEIGHT - (maxValue > 0 ? (values[0] / maxValue) * CHART_HEIGHT : 0);
        return `M0 ${y.toFixed(1)} L${CHART_WIDTH} ${y.toFixed(1)}`;
    }

    const stepX = CHART_WIDTH / (values.length - 1);
    return values
        .map((value, index) => {
            const x = index * stepX;
            const y = CHART_HEIGHT - (maxValue > 0 ? (value / maxValue) * CHART_HEIGHT : 0);
            return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");
}

export function ModeEvolutionChart({ data }: ModeEvolutionChartProps) {
    const hasData = data.dates.length > 0;
    const maxValue = Math.max(1, ...data.series.map((series) => series.totalCo2SavedKg));
    const ranked = [...data.series].sort((a, b) => b.totalCo2SavedKg - a.totalCo2SavedKg);

    return (
        <section className="flex flex-col gap-2 text-white">
            <p className="text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                CO2 saved by mode &middot; since day one
            </p>
            {hasData ? (
                <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    className="h-24 w-full overflow-visible"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Cumulative CO2 saved per transport mode over time"
                >
                    <line
                        x1={0}
                        y1={CHART_HEIGHT}
                        x2={CHART_WIDTH}
                        y2={CHART_HEIGHT}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth={1}
                    />
                    {data.series.map((series) => (
                        <path
                            key={series.mode}
                            d={buildPath(series.cumulativeCo2SavedKg, maxValue)}
                            fill="none"
                            stroke={MODE_COLORS[series.mode]}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
            ) : (
                <p className="text-sm text-emerald-100/70">Collecting the first journeys&hellip;</p>
            )}
            <ol className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {ranked.map((series, index) => {
                    const mode = MODES.find((item) => item.id === series.mode);
                    return (
                        <li
                            key={series.mode}
                            className="flex min-w-0 items-center gap-1.5"
                        >
                            <span
                                aria-hidden="true"
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: MODE_COLORS[series.mode] }}
                            />
                            <span className="shrink-0 text-emerald-100/60 tabular-nums">{index + 1}.</span>
                            <span aria-hidden="true">{mode?.emoji}</span>
                            <span className="truncate text-emerald-100/85">{mode?.label}</span>
                            <span className="ml-auto shrink-0 font-semibold text-lime-200 tabular-nums">
                                {series.totalCo2SavedKg.toFixed(1)}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
