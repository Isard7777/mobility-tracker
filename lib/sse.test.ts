import { describe, expect, it, vi } from "vitest";
import { publishEntry, subscribeToEntries, type StreamEntry } from "./sse";

const entry: StreamEntry = {
    id: "1",
    quadrigram: "ADUP",
    personName: "Alice Dupont",
    mode: "bike",
    km: 10,
    co2SavedKg: 2.18,
    entryDate: "2026-09-05",
    createdAt: "2026-09-05T12:00:00.000Z",
};

describe("mobility stream bus", () => {
    it("notifies subscribers of a new entry", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeToEntries(listener);

        publishEntry(entry);

        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith(entry);
        unsubscribe();
    });

    it("stops notifying a removed subscriber", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeToEntries(listener);
        unsubscribe();

        publishEntry(entry);

        expect(listener).not.toHaveBeenCalled();
    });
});
