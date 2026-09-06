import { describe, expect, it } from "vitest";
import { isAdminAuthorized } from "./admin-auth";

function basicAuth(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

describe("isAdminAuthorized", () => {
    it("accepts the configured admin credentials", () => {
        expect(isAdminAuthorized(basicAuth("admin", "secret"), "secret")).toBe(true);
    });

    it("rejects missing, incorrect, or non-admin credentials", () => {
        expect(isAdminAuthorized(null, "secret")).toBe(false);
        expect(isAdminAuthorized(basicAuth("admin", "wrong"), "secret")).toBe(false);
        expect(isAdminAuthorized(basicAuth("employee", "secret"), "secret")).toBe(false);
        expect(isAdminAuthorized(basicAuth("admin", "secret"), undefined)).toBe(false);
    });
});
