import { describe, expect, it } from "vitest";
import { MODES } from "./modes";

describe("transport modes", () => {
    it("puts the most-used alternative mode first with a clear icon", () => {
        expect(MODES[0]).toEqual({ id: "ebike", label: "E-bike", emoji: "🚲⚡" });
    });
});
