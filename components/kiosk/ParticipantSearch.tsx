"use client";

import { Leaf } from "lucide-react";
import { useState } from "react";
import type { Participant } from "@/config/participants";
import { filterParticipants } from "@/lib/participant-search";

type ParticipantSearchProps = {
    participants: readonly Participant[];
    weeklyCo2ByQuadrigram?: Record<string, number>;
    onSelect: (participant: Participant) => void;
};

export function ParticipantSearch({ participants, weeklyCo2ByQuadrigram, onSelect }: ParticipantSearchProps) {
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
                className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-white px-6 py-5 text-3xl text-emerald-950 shadow-sm ring-2 ring-transparent outline-none placeholder:text-emerald-800/45 focus:ring-emerald-500"
            />

            <div className="grid w-full max-w-xl gap-3 overflow-y-auto">
                {results.map((participant) => (
                    <EmployeeOption
                        key={participant.quadrigram}
                        participant={participant}
                        weeklyCo2SavedKg={weeklyCo2ByQuadrigram?.[participant.quadrigram]}
                        onSelect={onSelect}
                    />
                ))}

                {results.length === 0 && <p className="px-2 text-center text-xl text-emerald-800/55">No results</p>}
            </div>
        </div>
    );
}

type EmployeeOptionProps = {
    participant: Participant;
    weeklyCo2SavedKg?: number;
    onSelect: (participant: Participant) => void;
};

function EmployeeOption({ participant, weeklyCo2SavedKg, onSelect }: EmployeeOptionProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(participant)}
            className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-6 py-4 text-left text-emerald-950 shadow-sm transition active:scale-[0.98] active:border-emerald-600 active:bg-emerald-600 active:text-white"
        >
            <span className="text-2xl font-semibold">{participant.displayName}</span>
            <span className="flex flex-col items-end gap-0.5">
                <span className="text-lg text-emerald-700/65">{participant.quadrigram}</span>
                {weeklyCo2SavedKg !== undefined && (
                    <span className="flex items-center gap-1 text-base font-semibold text-emerald-700">
                        <Leaf
                            aria-hidden="true"
                            size={16}
                        />
                        {weeklyCo2SavedKg.toFixed(1)} kg CO2 this week
                    </span>
                )}
            </span>
        </button>
    );
}
