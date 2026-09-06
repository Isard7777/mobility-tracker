import { describe, expect, it } from "vitest";
import { parseParticipantCsv } from "./participant-import";

describe("parseParticipantCsv", () => {
    it("parses a semicolon-separated roster and normalizes quadrigrams", () => {
        expect(parseParticipantCsv("quadrigram;display_name\nadup;Alice Dupont")).toEqual({
            participants: [{ quadrigram: "ADUP", displayName: "Alice Dupont" }],
            errors: [],
        });
    });

    it("rejects invalid headers and duplicate quadrigrams", () => {
        expect(parseParticipantCsv("code;name\nADUP;Alice Dupont").errors).not.toHaveLength(0);
        expect(
            parseParticipantCsv("quadrigram;display_name\nADUP;Alice Dupont\nADUP;Alice Doe").errors
        ).not.toHaveLength(0);
    });

    it("requires four-character alphanumeric quadrigrams", () => {
        expect(parseParticipantCsv("quadrigram;display_name\nALICE;Alice Dupont").errors).not.toHaveLength(0);
    });
});
