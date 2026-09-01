import type { ModeId } from "@/config/modes";

// Emission factors in kg CO2e per passenger-km.
// Source: ADEME Base Empreinte (https://base-empreinte.ademe.fr) national averages,
// used as inspiration by the Wallonia mobility calculator (https://mobilite.wallonie.be).
// Walking and cycling have no marginal tank-to-wheel emissions.
const CAR_SOLO_FACTOR_KG_PER_KM = 0.218;

export const MODE_FACTORS_KG_PER_KM: Record<ModeId, number> = {
    bike: 0,
    walk: 0,
    ebike: 0.003,
    bus: 0.103,
    train: 0.0242,
    tram: 0.0035,
    carpool: 0.109, // solo car factor split across ~2 occupants
};

// CO2 saved by using `mode` instead of driving alone, computed server-side only.
export function estimateCo2SavedKg(mode: ModeId, km: number): number {
    const saved =
        (CAR_SOLO_FACTOR_KG_PER_KM - MODE_FACTORS_KG_PER_KM[mode]) * km;
    return Math.max(0, Number(saved.toFixed(3)));
}
