import { EventEmitter } from "node:events";
import type { ModeId } from "@/config/modes";

export type StreamEntry = {
    id: string;
    quadrigram: string;
    personName: string;
    mode: ModeId;
    km: number;
    co2SavedKg: number;
    entryDate: string;
    createdAt: string;
};

type StreamListener = (entry: StreamEntry) => void;

type GlobalWithStreamBus = typeof globalThis & {
    mobilityStreamBus?: EventEmitter;
};

const globalWithStreamBus = globalThis as GlobalWithStreamBus;
const streamBus = globalWithStreamBus.mobilityStreamBus ?? new EventEmitter();

streamBus.setMaxListeners(0);
globalWithStreamBus.mobilityStreamBus = streamBus;

export function publishEntry(entry: StreamEntry): void {
    streamBus.emit("entry", entry);
}

export function subscribeToEntries(listener: StreamListener): () => void {
    streamBus.on("entry", listener);
    return () => streamBus.off("entry", listener);
}
