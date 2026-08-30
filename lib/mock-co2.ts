import type { ModeId } from "@/config/modes";

// Rough estimate for the kiosk mock (phase 1).
// Replaced in phase 2 by lib/co2.ts with sourced ADEME/Base Empreinte factors.
const CAR_SOLO_FACTOR_KG_PER_KM = 0.218;

const MODE_FACTORS_KG_PER_KM: Record<ModeId, number> = {
  bike: 0,
  walk: 0,
  ebike: 0.003,
  bus: 0.103,
  train: 0.0242,
  tram: 0.0035,
  carpool: 0.109,
};

export function estimateCo2SavedKg(mode: ModeId, km: number): number {
  const saved = (CAR_SOLO_FACTOR_KG_PER_KM - MODE_FACTORS_KG_PER_KM[mode]) * km;
  return Math.max(0, Number(saved.toFixed(3)));
}
