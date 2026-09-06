import { describe, expect, it } from "vitest";
import { getEquivalents } from "./equivalents";

describe("getEquivalents", () => {
    it("returns 0 equivalents for 0 kg of CO2", () => {
        expect(getEquivalents(0)).toEqual({
            liegeBrusselsCarRoundTrips: 0,
            liegeParisCarRoundTrips: 0,
            intercityTrainKm: 0,
            shortHaulFlightKm: 0,
            treeYears: 0,
            beefSteaks: 0,
            hotShowers: 0,
            smartphoneChargingYears: 0,
        });
    });

    it("scales linearly with the CO2 amount", () => {
        const a = getEquivalents(100);
        const b = getEquivalents(200);
        expect(b.liegeBrusselsCarRoundTrips).toBeCloseTo(a.liegeBrusselsCarRoundTrips * 2, 5);
        expect(b.intercityTrainKm).toBeCloseTo(a.intercityTrainKm * 2, 0);
        expect(b.shortHaulFlightKm).toBeCloseTo(a.shortHaulFlightKm * 2, 5);
        expect(b.treeYears).toBeCloseTo(a.treeYears * 2, 5);
        expect(b.beefSteaks).toBeCloseTo(a.beefSteaks * 2, 1);
        expect(b.hotShowers).toBeCloseTo(a.hotShowers * 2, 5);
        expect(b.smartphoneChargingYears).toBeCloseTo(a.smartphoneChargingYears * 2, 0);
    });

    it("uses the documented transport factors", () => {
        expect(getEquivalents(100)).toMatchObject({
            intercityTrainKm: 11135.9,
            shortHaulFlightKm: 445.3,
        });
    });

    it("documents communication estimates as fixed assumptions", () => {
        expect(getEquivalents(4.2)).toMatchObject({
            treeYears: 0.2,
            beefSteaks: 1,
            hotShowers: 10.5,
            smartphoneChargingYears: 6,
        });
    });
});
