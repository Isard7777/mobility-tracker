import type { Participant } from "@/config/participants";

const DEFAULT_LIMIT = 8;

// Filters participants by quadrigram or name, case- and accent-insensitive.
export function filterParticipants(
    participants: readonly Participant[],
    query: string,
    limit = DEFAULT_LIMIT,
): Participant[] {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return participants.slice(0, limit);

    return participants
        .filter(
            (p) =>
                normalize(p.quadrigram).includes(normalizedQuery) ||
                normalize(p.displayName).includes(normalizedQuery),
        )
        .slice(0, limit);
}

function normalize(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
