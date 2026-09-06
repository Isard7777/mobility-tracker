import { describe, expect, it } from "vitest";
import { getEquivalents } from "./equivalents";

describe("getEquivalents", () => {
    it("returns 0 equivalents for 0 kg of CO2", () => {
        expect(getEquivalents(0)).toEqual({
            treeYears: 0,
            liegeBrusselsCarRoundTrips: 0,
            liegeParisCarRoundTrips: 0,
            flightHours: 0,
            smartphoneChargeYears: 0,
            hotShowers: 0,
            beefSteaks: 0,
        });
    });

    it("scales linearly with the CO2 amount", () => {
        const a = getEquivalents(100);
        const b = getEquivalents(200);
        expect(b.treeYears).toBeCloseTo(a.treeYears * 2, 5);
        expect(b.liegeBrusselsCarRoundTrips).toBeCloseTo(a.liegeBrusselsCarRoundTrips * 2, 5);
        expect(b.flightHours).toBeCloseTo(a.flightHours * 2, 5);
    });

    it("one tree-year equivalent is roughly 25 kg of CO2", () => {
        expect(getEquivalents(25).treeYears).toBeCloseTo(1, 1);
    });
});
