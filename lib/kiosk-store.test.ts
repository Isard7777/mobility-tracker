import { beforeEach, describe, expect, it } from "vitest";
import { addKioskEntry, getKioskTotals, resetKioskStore } from "./kiosk-store";
import type { Participant } from "@/config/participants";

const ALICE: Participant = { quadrigram: "ADUP", displayName: "Alice Dupont" };
const BENOIT: Participant = { quadrigram: "BLEF", displayName: "Benoit Lefevre" };
const CHLOE: Participant = { quadrigram: "CMAR", displayName: "Chloe Martin" };

describe("kiosk-store", () => {
  beforeEach(() => {
    resetKioskStore();
  });

  it("starts empty", () => {
    expect(getKioskTotals()).toEqual({
      totalKm: 0,
      totalCo2SavedKg: 0,
      participantsCount: 0,
    });
  });

  it("accumulates km and co2 across entries", () => {
    addKioskEntry(ALICE, "bike", 10);
    addKioskEntry(BENOIT, "bus", 5);

    const totals = getKioskTotals();
    expect(totals.totalKm).toBe(15);
    expect(totals.totalCo2SavedKg).toBeGreaterThan(0);
  });

  it("counts unique participants (by quadrigramme) only once", () => {
    addKioskEntry(ALICE, "bike", 10);
    addKioskEntry(ALICE, "walk", 2);

    expect(getKioskTotals().participantsCount).toBe(1);
  });

  it("returns an entry with a generated id and computed co2", () => {
    const entry = addKioskEntry(CHLOE, "train", 20);
    expect(entry.id).toBeTruthy();
    expect(entry.co2SavedKg).toBeGreaterThan(0);
  });
});
