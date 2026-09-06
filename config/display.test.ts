import { describe, expect, it } from "vitest";
import {
    DEFAULT_TREE_GROWTH_MAX_KM,
    getTreeGrowthProgress,
    getTreeGrowthStep,
    parseTreeGrowthMaxKm,
    TREE_GROWTH,
} from "./display";

describe("tree growth configuration", () => {
    it("divides the configured maximum into 20 equal stages", () => {
        expect(getTreeGrowthStep(500)).toBe(1);
        expect(getTreeGrowthStep(5_000)).toBe(10);
        expect(getTreeGrowthStep(TREE_GROWTH.maxKm)).toBe(20);
    });

    it("caps visual progress without limiting the entered kilometres", () => {
        expect(getTreeGrowthStep(50_000)).toBe(TREE_GROWTH.steps);
        expect(getTreeGrowthProgress(50_000)).toBe(1);
    });

    it("does not produce negative stages", () => {
        expect(getTreeGrowthStep(-100)).toBe(0);
    });

    it("falls back to the default for an invalid configured maximum", () => {
        expect(parseTreeGrowthMaxKm(undefined)).toBe(DEFAULT_TREE_GROWTH_MAX_KM);
        expect(parseTreeGrowthMaxKm("0")).toBe(DEFAULT_TREE_GROWTH_MAX_KM);
        expect(parseTreeGrowthMaxKm("not-a-number")).toBe(DEFAULT_TREE_GROWTH_MAX_KM);
    });
});
