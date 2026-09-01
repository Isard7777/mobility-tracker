import { z } from "zod";
import { MODES } from "@/config/modes";

const MODE_IDS = MODES.map((m) => m.id) as [string, ...string[]];

export const createEntrySchema = z.object({
    quadrigram: z.string().trim().min(1).max(10),
    mode: z.enum(MODE_IDS),
    km: z.number().positive().max(200),
    source: z.enum(["kiosk", "web"]).default("web"),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
