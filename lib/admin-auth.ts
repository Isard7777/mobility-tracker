import { timingSafeEqual } from "node:crypto";

const ADMIN_USERNAME = "admin";

export function isAdminAuthorized(authorization: string | null, password: string | undefined): boolean {
    if (!authorization?.startsWith("Basic ") || !password) return false;

    try {
        const decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8");
        const separator = decoded.indexOf(":");
        if (separator === -1) return false;

        const username = decoded.slice(0, separator);
        const providedPassword = Buffer.from(decoded.slice(separator + 1));
        const expectedPassword = Buffer.from(password);
        return (
            username === ADMIN_USERNAME &&
            providedPassword.length === expectedPassword.length &&
            timingSafeEqual(providedPassword, expectedPassword)
        );
    } catch {
        return false;
    }
}

export function adminUnauthorizedResponse(): Response {
    return new Response("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Mobility Tracker Admin", charset="UTF-8"' },
    });
}
