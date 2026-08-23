import { z } from "zod";
import { MODES } from "@/config/modes";

const MODE_IDS = MODES.map((m) => m.id) as [string, ...string[]];

export const createEntrySchema = z
    .object({
        quadrigram: z.string().trim().min(1).max(10),
        mode: z.enum(MODE_IDS),
        oneWayKm: z.number().positive().finite(),
        entryDate: z.string().date().optional(),
        carpoolOccupants: z.number().int().min(2).max(8).optional(),
        source: z.enum(["kiosk", "web"]).default("web"),
    })
    .superRefine((entry, context) => {
        if (entry.mode === "carpool" && entry.carpoolOccupants === undefined) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Carpool occupants are required for carpool entries",
                path: ["carpoolOccupants"],
            });
        }
    });

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
