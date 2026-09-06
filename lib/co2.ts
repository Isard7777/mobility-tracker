import type { ModeId } from "@/config/modes";

// Lifecycle emission factors in kg CO2e per passenger-km from ADEME Base Empreinte,
// published by Impact CO2's transport API on 2026-09-06: https://impactco2.fr/api/v1/transport?km=1&displayAll=1&includeConstruction=1.
export const CAR_SOLO_FACTOR_KG_PER_KM = 0.14225341222954335;

export const MODE_FACTORS_KG_PER_KM: Record<ModeId, number> = {
    bike: 0.00017,
    walk: 0,
    ebike: 0.01095,
    bus: 0.12242,
    train: 0.00898,
    tram: 0.00428,
    carpool: CAR_SOLO_FACTOR_KG_PER_KM / 2,
};

// CO2 saved by using `mode` instead of driving alone, computed server-side only.
export function estimateCo2SavedKg(mode: ModeId, km: number, carpoolOccupants?: number): number {
    const modeFactor =
        mode === "carpool" ? CAR_SOLO_FACTOR_KG_PER_KM / (carpoolOccupants ?? 2) : MODE_FACTORS_KG_PER_KM[mode];
    const saved = (CAR_SOLO_FACTOR_KG_PER_KM - modeFactor) * km;
    return Math.max(0, Number(saved.toFixed(3)));
}
