import { describe, expect, it } from "vitest";
import { INITIAL_PARTICIPANTS } from "./participants";

describe("initial participant roster", () => {
    it("is a non-empty list of unique names", () => {
        expect(INITIAL_PARTICIPANTS.length).toBeGreaterThan(0);
        expect(new Set(INITIAL_PARTICIPANTS.map((participant) => participant.quadrigram)).size).toBe(
            INITIAL_PARTICIPANTS.length
        );
    });
});
