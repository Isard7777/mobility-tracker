import { describe, expect, it } from "vitest";
import { isExportGroup } from "./admin-exports";

describe("isExportGroup", () => {
    it("accepts the full journey-data export and rejects retired groups", () => {
        expect(isExportGroup("entries")).toBe(true);
        expect(isExportGroup("government")).toBe(false);
    });
});
