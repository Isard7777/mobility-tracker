"use client";

import { Check, Leaf } from "lucide-react";
import { FormEvent, useState } from "react";
import { MODES, type ModeId } from "@/config/modes";
import { PARTICIPANTS } from "@/config/participants";

const LAST_QUADRIGRAM_KEY = "mobility-tracker:last-quadrigram";

function getToday(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

export function DesktopEntryForm() {
    const [employeeInput, setEmployeeInput] = useState("");
    const [mode, setMode] = useState<ModeId>("bike");
    const [oneWayKm, setOneWayKm] = useState("");
    const [entryDate, setEntryDate] = useState(getToday);
    const [carpoolOccupants, setCarpoolOccupants] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const selectedParticipant = PARTICIPANTS.find(
        (participant) =>
            participant.quadrigram.toLowerCase() === employeeInput.trim().toLowerCase() ||
            participant.displayName.toLowerCase() === employeeInput.trim().toLowerCase()
    );
    const distance = Number(oneWayKm.replace(",", "."));

    function useLastParticipant() {
        const quadrigram = localStorage.getItem(LAST_QUADRIGRAM_KEY);
        if (quadrigram) setEmployeeInput(quadrigram);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!selectedParticipant || !(distance > 0 && Number.isFinite(distance))) {
            setErrorMessage("Choose a participant and enter a valid one-way distance.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quadrigram: selectedParticipant.quadrigram,
                    mode,
                    oneWayKm: distance,
                    entryDate,
                    ...(mode === "carpool" ? { carpoolOccupants } : {}),
                    source: "web",
                }),
            });
            if (!response.ok) throw new Error("Entry could not be saved.");

            const entry: { co2SavedKg: number } = await response.json();
            localStorage.setItem(LAST_QUADRIGRAM_KEY, selectedParticipant.quadrigram);
            setOneWayKm("");
            setSuccessMessage(`Saved. ${entry.co2SavedKg.toFixed(2)} kg CO2 avoided.`);
        } catch {
            setErrorMessage("Entry could not be saved. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="mx-auto w-full max-w-2xl px-8 py-12 xl:px-16 xl:py-16">
            <p className="text-sm font-semibold tracking-[0.16em] text-emerald-700 uppercase">Mobility week</p>
            <h1 className="mt-3 text-4xl font-bold text-emerald-950">Log a journey</h1>
            <p className="mt-3 max-w-lg text-lg text-emerald-950/70">
                Record your one-way sustainable commute. The round trip is calculated automatically.
            </p>

            <form
                className="mt-10 space-y-7"
                onSubmit={handleSubmit}
            >
                <label className="block text-sm font-semibold text-emerald-950">
                    Participant
                    <div className="mt-2 flex gap-2">
                        <input
                            list="participants"
                            value={employeeInput}
                            onChange={(event) => setEmployeeInput(event.target.value)}
                            placeholder="Employee code or name"
                            className="min-w-0 flex-1 border border-emerald-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                        <button
                            type="button"
                            onClick={useLastParticipant}
                            className="border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                        >
                            Use last
                        </button>
                    </div>
                    <datalist id="participants">
                        {PARTICIPANTS.map((participant) => (
                            <option
                                key={participant.quadrigram}
                                value={participant.quadrigram}
                            >
                                {participant.displayName}
                            </option>
                        ))}
                    </datalist>
                </label>

                <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-emerald-950">
                        Transport mode
                        <select
                            value={mode}
                            onChange={(event) => setMode(event.target.value as ModeId)}
                            className="mt-2 w-full border border-emerald-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        >
                            {MODES.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm font-semibold text-emerald-950">
                        Journey date
                        <input
                            type="date"
                            value={entryDate}
                            onChange={(event) => setEntryDate(event.target.value)}
                            className="mt-2 w-full border border-emerald-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                </div>

                <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-emerald-950">
                        One-way distance (km)
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            inputMode="decimal"
                            value={oneWayKm}
                            onChange={(event) => setOneWayKm(event.target.value)}
                            placeholder="0"
                            className="mt-2 w-full border border-emerald-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    {mode === "carpool" && (
                        <label className="block text-sm font-semibold text-emerald-950">
                            Carpool occupants
                            <input
                                type="number"
                                min="2"
                                max="8"
                                value={carpoolOccupants}
                                onChange={(event) => setCarpoolOccupants(Number(event.target.value))}
                                className="mt-2 w-full border border-emerald-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                            />
                        </label>
                    )}
                </div>

                {distance > 0 && Number.isFinite(distance) && (
                    <p className="flex items-center gap-2 border-l-4 border-lime-500 bg-lime-50 px-4 py-3 text-emerald-900">
                        <Leaf
                            size={20}
                            aria-hidden="true"
                        />
                        {Math.round(distance * 2 * 100) / 100} km will be recorded for the round trip.
                    </p>
                )}

                {errorMessage && <p className="text-sm font-semibold text-red-700">{errorMessage}</p>}
                {successMessage && (
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <Check
                            size={18}
                            aria-hidden="true"
                        />
                        {successMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-700 px-6 py-4 text-lg font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-200"
                >
                    {isSubmitting ? "Saving..." : "Save journey"}
                </button>
            </form>
        </section>
    );
}
