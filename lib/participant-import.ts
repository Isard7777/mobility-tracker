import type { Participant } from "@/config/participants";

const CSV_HEADERS = ["quadrigram", "display_name"];
const QUADRIGRAM_PATTERN = /^[A-Z0-9]{4}$/;

export type ParticipantImportResult =
    { participants: Participant[]; errors: [] } | { participants: []; errors: string[] };

export function parseParticipantCsv(content: string): ParticipantImportResult {
    const lines = content
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    if (lines.length < 2)
        return { participants: [], errors: ["CSV must include a header and at least one participant."] };

    const delimiter = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(delimiter).map((value) => value.trim().toLowerCase());
    if (headers.length !== 2 || headers[0] !== CSV_HEADERS[0] || headers[1] !== CSV_HEADERS[1]) {
        return { participants: [], errors: ["CSV header must be: quadrigram;display_name"] };
    }

    const participants: Participant[] = [];
    const errors: string[] = [];
    const seenQuadrigrams = new Set<string>();

    lines.slice(1).forEach((line, index) => {
        const values = line.split(delimiter).map((value) => value.trim());
        const row = index + 2;
        const quadrigram = values[0]?.toUpperCase();
        const displayName = values[1];
        if (values.length !== 2 || !quadrigram || !displayName) {
            errors.push(`Row ${row} must contain a quadrigram and display name.`);
            return;
        }
        if (!QUADRIGRAM_PATTERN.test(quadrigram)) {
            errors.push(`Row ${row} has an invalid quadrigram.`);
            return;
        }
        if (displayName.length > 120) {
            errors.push(`Row ${row} has a display name that is too long.`);
            return;
        }
        if (seenQuadrigrams.has(quadrigram)) {
            errors.push(`Row ${row} repeats quadrigram ${quadrigram}.`);
            return;
        }
        seenQuadrigrams.add(quadrigram);
        participants.push({ quadrigram, displayName });
    });

    return errors.length > 0 ? { participants: [], errors } : { participants, errors: [] };
}
