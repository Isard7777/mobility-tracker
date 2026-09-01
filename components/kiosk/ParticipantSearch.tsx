"use client";

import { useState } from "react";
import type { Participant } from "@/config/participants";
import { filterParticipants } from "@/lib/participant-search";

type ParticipantSearchProps = {
    participants: readonly Participant[];
    onSelect: (participant: Participant) => void;
};

export function ParticipantSearch({ participants, onSelect }: ParticipantSearchProps) {
    const [query, setQuery] = useState("");
    const results = filterParticipants(participants, query);

    return (
        <div className="flex h-full w-full flex-col items-center gap-6 p-6">
            <input
                type="text"
                inputMode="text"
                autoFocus
                autoCorrect="off"
                autoCapitalize="characters"
                placeholder="Employee code or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-xl rounded-2xl bg-neutral-800 px-6 py-5 text-3xl text-white placeholder-neutral-500 ring-2 ring-transparent outline-none focus:ring-emerald-600"
            />

            <div className="grid w-full max-w-xl gap-3 overflow-y-auto">
                {results.map((participant) => (
                    <button
                        key={participant.quadrigram}
                        type="button"
                        onClick={() => onSelect(participant)}
                        className="flex items-center justify-between rounded-2xl bg-neutral-800 px-6 py-4 text-left text-white shadow-lg transition active:scale-[0.98] active:bg-emerald-600"
                    >
                        <span className="text-2xl font-semibold">{participant.displayName}</span>
                        <span className="text-lg text-neutral-400">{participant.quadrigram}</span>
                    </button>
                ))}

                {results.length === 0 && <p className="px-2 text-center text-xl text-neutral-500">No results</p>}
            </div>
        </div>
    );
}
