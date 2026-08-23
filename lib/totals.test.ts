import { describe, expect, it } from "vitest";
import { getCurrentWeekRange } from "./totals";

describe("getCurrentWeekRange", () => {
    it("starts on Monday and ends on the following Monday", () => {
        const { start, end } = getCurrentWeekRange(new Date("2026-09-05T12:00:00Z"));

        expect(start.toISOString()).toBe("2026-08-31T00:00:00.000Z");
        expect(end.toISOString()).toBe("2026-09-07T00:00:00.000Z");
    });

    it("keeps Monday within the current week", () => {
        const { start, end } = getCurrentWeekRange(new Date("2026-08-31T12:00:00Z"));

        expect(start.toISOString()).toBe("2026-08-31T00:00:00.000Z");
        expect(end.toISOString()).toBe("2026-09-07T00:00:00.000Z");
    });
});
