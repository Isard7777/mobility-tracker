"use client";

import { motion } from "framer-motion";
import { getTreeGrowthProgress, getTreeGrowthStep } from "@/config/display";

type GrowingTreeProps = {
    totalKm: number;
    pulseKey: string;
};

const CANOPY_LAYERS = [
    {
        startStep: 4,
        d: "M112 395 C102 338 144 292 207 302 C226 250 310 244 343 299 C408 280 450 326 430 382 C455 424 416 470 362 461 C326 500 248 494 217 461 C154 476 99 448 112 395 Z",
        fill: "url(#canopy-low)",
    },
    {
        startStep: 8,
        d: "M79 313 C67 250 127 211 189 230 C204 172 284 151 329 203 C391 171 452 218 434 278 C467 321 428 370 374 363 C332 410 244 403 215 364 C151 391 87 367 79 313 Z",
        fill: "url(#canopy-mid)",
    },
    {
        startStep: 12,
        d: "M121 218 C113 153 176 119 230 142 C253 80 342 80 367 144 C425 128 464 177 438 228 C455 275 413 304 367 289 C326 337 245 326 219 287 C165 307 118 271 121 218 Z",
        fill: "url(#canopy-high)",
    },
    {
        startStep: 16,
        d: "M169 139 C167 81 226 43 273 75 C316 25 394 59 392 117 C448 136 448 196 399 216 C367 264 286 253 260 215 C204 233 161 194 169 139 Z",
        fill: "url(#canopy-crown)",
    },
] as const;

const LEAF_ACCENTS = [
    { step: 6, x: 225, y: 421, rotate: -34, fill: "#bef264" },
    { step: 7, x: 303, y: 403, rotate: 24, fill: "#a3e635" },
    { step: 8, x: 130, y: 362, rotate: -48, fill: "#d9f99d" },
    { step: 9, x: 374, y: 351, rotate: 42, fill: "#bef264" },
    { step: 10, x: 239, y: 336, rotate: 0, fill: "#d9f99d" },
    { step: 11, x: 170, y: 274, rotate: -28, fill: "#bef264" },
    { step: 12, x: 336, y: 275, rotate: 33, fill: "#d9f99d" },
    { step: 13, x: 424, y: 290, rotate: 56, fill: "#a3e635" },
    { step: 14, x: 207, y: 199, rotate: -26, fill: "#d9f99d" },
    { step: 15, x: 362, y: 206, rotate: 34, fill: "#bef264" },
    { step: 16, x: 286, y: 151, rotate: 5, fill: "#d9f99d" },
    { step: 17, x: 227, y: 104, rotate: -22, fill: "#bef264" },
    { step: 18, x: 333, y: 110, rotate: 28, fill: "#d9f99d" },
    { step: 19, x: 394, y: 158, rotate: 43, fill: "#a3e635" },
    { step: 20, x: 163, y: 171, rotate: -45, fill: "#d9f99d" },
] as const;

function layerProgress(growthStep: number, startStep: number): number {
    return Math.min(1, Math.max(0, (growthStep - startStep + 1) / 5));
}

export function GrowingTree({ totalKm, pulseKey }: GrowingTreeProps) {
    const progress = getTreeGrowthProgress(totalKm);
    const growthStep = getTreeGrowthStep(totalKm);
    const trunkGrowth = Math.min(1, progress * 5);
    const branchGrowth = Math.min(1, Math.max(0, progress * 5 - 0.35));

    return (
        <motion.svg
            key={pulseKey}
            viewBox="0 0 520 660"
            role="img"
            aria-label="A tree growing with collective travel distance"
            className="h-full max-h-[72vh] w-full overflow-visible"
            animate={{ scaleX: [1.35, 1.37, 1.35], scaleY: [1, 1.015, 1] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <defs>
                <linearGradient
                    id="trunk"
                    x1="0"
                    x2="1"
                >
                    <stop stopColor="#5e3b20" />
                    <stop
                        offset="1"
                        stopColor="#9a6335"
                    />
                </linearGradient>
                <linearGradient
                    id="canopy-low"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop stopColor="#84cc16" />
                    <stop
                        offset="1"
                        stopColor="#3f6212"
                    />
                </linearGradient>
                <linearGradient
                    id="canopy-mid"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop stopColor="#a3e635" />
                    <stop
                        offset="1"
                        stopColor="#4d7c0f"
                    />
                </linearGradient>
                <linearGradient
                    id="canopy-high"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop stopColor="#bef264" />
                    <stop
                        offset="1"
                        stopColor="#65a30d"
                    />
                </linearGradient>
                <linearGradient
                    id="canopy-crown"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop stopColor="#d9f99d" />
                    <stop
                        offset="1"
                        stopColor="#84cc16"
                    />
                </linearGradient>
            </defs>
            <ellipse
                cx="260"
                cy="618"
                rx="208"
                ry="28"
                fill="#163d2c"
                opacity="0.4"
            />
            <motion.path
                d="M240 610 C240 480 232 365 258 250 C278 365 292 474 292 610 Z"
                fill="url(#trunk)"
                initial={false}
                animate={{ scaleY: Math.max(0.12, trunkGrowth), opacity: trunkGrowth }}
                style={{ originX: "50%", originY: "100%" }}
            />
            <motion.path
                d="M258 520 C212 508 175 486 136 446 M274 520 C326 502 365 472 400 436"
                fill="none"
                stroke="#784a28"
                strokeLinecap="round"
                strokeWidth="18"
                initial={false}
                animate={{ pathLength: branchGrowth, opacity: branchGrowth }}
            />
            <motion.g
                initial={false}
                animate={{ scale: growthStep >= 1 ? 1 : 0.1, opacity: growthStep >= 1 ? 1 : 0 }}
                style={{ originX: "50%", originY: "100%" }}
            >
                <path
                    d="M258 514 C238 479 242 453 258 424 C276 454 280 480 258 514 Z"
                    fill="#65a30d"
                />
                <path
                    d="M253 476 C222 455 202 455 181 465 C204 484 228 489 253 476 Z"
                    fill="#a3e635"
                />
                <path
                    d="M263 468 C288 442 314 439 336 448 C314 475 288 483 263 468 Z"
                    fill="#bef264"
                />
            </motion.g>
            {CANOPY_LAYERS.map((layer) => {
                const progress = layerProgress(growthStep, layer.startStep);
                return (
                    <motion.path
                        key={layer.startStep}
                        d={layer.d}
                        fill={layer.fill}
                        initial={false}
                        animate={{ scale: Math.max(0.05, progress), opacity: progress }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{ originX: "50%", originY: "50%" }}
                    />
                );
            })}
            {LEAF_ACCENTS.map((leaf) => (
                <g
                    key={leaf.step}
                    transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate})`}
                >
                    <motion.path
                        d="M0 0 C-18 -12 -18 -39 0 -54 C18 -39 18 -12 0 0 Z"
                        fill={leaf.fill}
                        initial={false}
                        animate={{ scale: growthStep >= leaf.step ? 1 : 0, opacity: growthStep >= leaf.step ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ originX: "50%", originY: "100%" }}
                    />
                </g>
            ))}
        </motion.svg>
    );
}
