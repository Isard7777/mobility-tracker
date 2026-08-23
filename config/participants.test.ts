import { describe, expect, it } from "vitest";
import { PARTICIPANTS } from "./config/participants";

describe("participants config", () => {
  it("is a non-empty list of unique names", () => {
    expect(PARTICIPANTS.length).toBeGreaterThan(0);
    expect(new Set(PARTICIPANTS).size).toBe(PARTICIPANTS.length);
  });
});
