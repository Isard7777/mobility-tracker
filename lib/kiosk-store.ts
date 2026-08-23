import type { ModeId } from "@/config/modes";
import { estimateCo2SavedKg } from "./mock-co2";

export type KioskEntry = {
  id: string;
  name: string;
  mode: ModeId;
  km: number;
  co2SavedKg: number;
  createdAt: number;
};

export type KioskTotals = {
  totalKm: number;
  totalCo2SavedKg: number;
  participantsCount: number;
};

// Store en mémoire pour le mock du kiosk (phase 1) — remplacé en phase 2 par Postgres/Prisma.
let entries: KioskEntry[] = [];

export function addKioskEntry(name: string, mode: ModeId, km: number): KioskEntry {
  const entry: KioskEntry = {
    id: crypto.randomUUID(),
    name,
    mode,
    km,
    co2SavedKg: estimateCo2SavedKg(mode, km),
    createdAt: Date.now(),
  };
  entries.push(entry);
  return entry;
}

export function getKioskTotals(): KioskTotals {
  const totalKm = entries.reduce((sum, e) => sum + e.km, 0);
  const totalCo2SavedKg = entries.reduce((sum, e) => sum + e.co2SavedKg, 0);
  const participantsCount = new Set(entries.map((e) => e.name)).size;
  return {
    totalKm: Number(totalKm.toFixed(2)),
    totalCo2SavedKg: Number(totalCo2SavedKg.toFixed(3)),
    participantsCount,
  };
}

export function resetKioskStore(): void {
  entries = [];
}
