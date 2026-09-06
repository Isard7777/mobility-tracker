import { describe, expect, it } from "vitest";
import { estimateCo2SavedKg } from "./co2";

describe("estimateCo2SavedKg", () => {
    it("uses the documented ADEME lifecycle factors", () => {
        expect(estimateCo2SavedKg("walk", 10)).toBe(1.423);
        expect(estimateCo2SavedKg("bike", 10)).toBe(1.421);
        expect(estimateCo2SavedKg("ebike", 10)).toBe(1.313);
        expect(estimateCo2SavedKg("bus", 10)).toBe(0.198);
        expect(estimateCo2SavedKg("train", 10)).toBe(1.333);
        expect(estimateCo2SavedKg("tram", 10)).toBe(1.38);
    });

    it("saves more with walking/cycling than with the bus", () => {
        const walking = estimateCo2SavedKg("walk", 10);
        const bus = estimateCo2SavedKg("bus", 10);
        expect(walking).toBeGreaterThan(bus);
    });

    it("scales linearly with distance", () => {
        const km10 = estimateCo2SavedKg("bus", 10);
        const km20 = estimateCo2SavedKg("bus", 20);
        expect(km20).toBeCloseTo(km10 * 2, 2);
    });

    it("never returns a negative value", () => {
        expect(estimateCo2SavedKg("carpool", 1)).toBeGreaterThanOrEqual(0);
    });

    it("uses the declared carpool occupancy", () => {
        expect(estimateCo2SavedKg("carpool", 10, 4)).toBeGreaterThan(estimateCo2SavedKg("carpool", 10, 2));
        expect(estimateCo2SavedKg("carpool", 10, 1)).toBe(0);
    });
});
