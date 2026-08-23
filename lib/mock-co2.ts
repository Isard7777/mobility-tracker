import type { ModeId } from "@/config/modes";

// Estimation grossière pour le mock du kiosk (phase 1).
// Remplacée en phase 2 par lib/co2.ts avec les facteurs ADEME/Base Empreinte sourcés.
const CAR_SOLO_FACTOR_KG_PER_KM = 0.218;

const MODE_FACTORS_KG_PER_KM: Record<ModeId, number> = {
  velo: 0,
  marche: 0,
  vae: 0.003,
  bus: 0.103,
  train: 0.0242,
  tram: 0.0035,
  covoiturage: 0.109,
};

export function estimateCo2SavedKg(mode: ModeId, km: number): number {
  const saved = (CAR_SOLO_FACTOR_KG_PER_KM - MODE_FACTORS_KG_PER_KM[mode]) * km;
  return Math.max(0, Number(saved.toFixed(3)));
}
