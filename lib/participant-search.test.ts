import { describe, expect, it } from "vitest";
import { filterParticipants } from "./participant-search";
import type { Participant } from "@/config/participants";

const PARTICIPANTS: Participant[] = [
    { quadrigram: "ADUP", displayName: "Alice Dupont" },
    { quadrigram: "BLEF", displayName: "Benoit Lefevre" },
    { quadrigram: "GMOR", displayName: "Gaelle Moreau" },
];

describe("filterParticipants", () => {
    it("returns all participants (up to the limit) when the query is empty", () => {
        expect(filterParticipants(PARTICIPANTS, "")).toEqual(PARTICIPANTS);
    });

    it("matches by quadrigramme, case-insensitive", () => {
        expect(filterParticipants(PARTICIPANTS, "adup")).toEqual([
            PARTICIPANTS[0],
        ]);
    });

    it("matches by display name substring", () => {
        expect(filterParticipants(PARTICIPANTS, "dupont")).toEqual([
            PARTICIPANTS[0],
        ]);
    });

    it("ignores accents", () => {
        expect(filterParticipants(PARTICIPANTS, "gaelle")).toEqual([
            PARTICIPANTS[2],
        ]);
    });

    it("returns an empty array when nothing matches", () => {
        expect(filterParticipants(PARTICIPANTS, "zzzz")).toEqual([]);
    });

    it("respects the result limit", () => {
        expect(filterParticipants(PARTICIPANTS, "", 2)).toHaveLength(2);
    });
});
