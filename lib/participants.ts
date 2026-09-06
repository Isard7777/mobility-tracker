import { prisma } from "./db";
import type { Participant } from "@/config/participants";

export async function getParticipants(): Promise<Participant[]> {
    return prisma.participant.findMany({
        select: { quadrigram: true, displayName: true },
        orderBy: { displayName: "asc" },
    });
}
