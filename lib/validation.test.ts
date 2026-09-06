import { describe, expect, it } from "vitest";
import { createEntrySchema } from "./validation";

describe("createEntrySchema", () => {
    it("accepts a one-way distance above the former kiosk cap", () => {
        const result = createEntrySchema.safeParse({
            quadrigram: "ADUP",
            mode: "bike",
            oneWayKm: 1_234.5,
            source: "kiosk",
        });

        expect(result.success).toBe(true);
    });

    it("requires an occupant count for carpool entries", () => {
        const result = createEntrySchema.safeParse({
            quadrigram: "ADUP",
            mode: "carpool",
            oneWayKm: 30,
            source: "kiosk",
        });

        expect(result.success).toBe(false);
    });
});
