import { describe, expect, it } from "vitest";
import { getEquivalents } from "./equivalents";

describe("getEquivalents", () => {
    it("returns 0 equivalents for 0 kg of CO2", () => {
        expect(getEquivalents(0)).toEqual({
            treeYears: 0,
            carTripsBrusselsParis: 0,
        });
    });

    it("scales linearly with the CO2 amount", () => {
        const a = getEquivalents(25);
        const b = getEquivalents(50);
        expect(b.treeYears).toBeCloseTo(a.treeYears * 2, 5);
        expect(b.carTripsBrusselsParis).toBeCloseTo(a.carTripsBrusselsParis * 2, 5);
    });

    it("one tree-year equivalent is roughly 25 kg of CO2", () => {
        expect(getEquivalents(25).treeYears).toBeCloseTo(1, 1);
    });
});
