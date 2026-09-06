"use client";

import { AlertTriangle, FileUp, RefreshCcw, Users } from "lucide-react";
import { ChangeEvent, useState } from "react";
import type { Participant } from "@/config/participants";

function basicAuthorization(password: string): string {
    return `Basic ${btoa(`admin:${password}`)}`;
}

type AdminControlsProps = {
    password: string;
};

export function AdminControls({ password }: AdminControlsProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetAcknowledged, setResetAcknowledged] = useState(false);
    const [resetConfirmation, setResetConfirmation] = useState("");

    function headers(): HeadersInit {
        return { Authorization: basicAuthorization(password) };
    }

    async function loadParticipants() {
        setError("");
        setMessage("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/participants", { headers: headers() });
            if (!response.ok) throw new Error("The admin password was not accepted.");
            setParticipants(await response.json());
            setMessage("Participant roster loaded.");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not load the participant roster.");
        } finally {
            setIsLoading(false);
        }
    }

    async function importParticipants(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setError("");
        setMessage("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/participants", {
                method: "PUT",
                headers: { ...headers(), "Content-Type": "text/csv" },
                body: await file.text(),
            });
            const result = (await response.json()) as {
                participants?: Participant[];
                errors?: string[];
                error?: string;
            };
            if (!response.ok)
                throw new Error(result.errors?.join(" ") ?? result.error ?? "Could not import the roster.");
            setParticipants(result.participants ?? []);
            setMessage(`${result.participants?.length ?? 0} participants imported. The active roster was replaced.`);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not import the participant roster.");
        } finally {
            event.target.value = "";
            setIsLoading(false);
        }
    }

    async function resetJourneys() {
        if (!resetAcknowledged || resetConfirmation !== "DELETE JOURNEYS") return;
        setError("");
        setMessage("");
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/reset", {
                method: "POST",
                headers: { ...headers(), "Content-Type": "application/json" },
                body: JSON.stringify({ confirmation: resetConfirmation }),
            });
            const result = (await response.json()) as { deletedEntries?: number; error?: string };
            if (!response.ok) throw new Error(result.error ?? "Could not reset recorded journeys.");
            setResetAcknowledged(false);
            setResetConfirmation("");
            setMessage(`${result.deletedEntries ?? 0} recorded journeys were permanently deleted.`);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not reset recorded journeys.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <section className="border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <Users
                        aria-hidden="true"
                        size={24}
                        className="text-emerald-700"
                    />
                    <h2 className="text-2xl font-bold">Participant roster</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-950/70">
                    Import a complete CSV roster. Existing active participants are replaced; historic journey records
                    stay unchanged.
                </p>
                <p className="mt-3 bg-emerald-50 px-3 py-2 font-mono text-sm text-emerald-900">
                    quadrigram;display_name
                </p>
                <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
                    <FileUp
                        aria-hidden="true"
                        size={18}
                    />
                    Import CSV roster
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        disabled={isLoading}
                        onChange={importParticipants}
                        className="sr-only"
                    />
                </label>
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={loadParticipants}
                    className="mt-3 flex w-full items-center justify-center gap-2 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-emerald-300"
                >
                    <RefreshCcw
                        aria-hidden="true"
                        size={18}
                    />
                    Refresh roster
                </button>
                {participants.length > 0 && (
                    <ul className="mt-5 max-h-56 divide-y divide-emerald-100 overflow-y-auto border-t border-emerald-100">
                        {participants.map((participant) => (
                            <li
                                key={participant.quadrigram}
                                className="flex justify-between py-2 text-sm"
                            >
                                <span>{participant.displayName}</span>
                                <span className="font-mono text-emerald-800">{participant.quadrigram}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="border border-red-200 bg-red-50 p-6 shadow-sm">
                <div className="flex items-center gap-3 text-red-900">
                    <AlertTriangle
                        aria-hidden="true"
                        size={24}
                    />
                    <h2 className="text-2xl font-bold">Reset journey data</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-red-950/75">
                    This permanently deletes every recorded journey and its CO2 data. The active participant roster is
                    preserved.
                </p>
                <label className="mt-5 flex items-start gap-3 text-sm font-medium text-red-950">
                    <input
                        type="checkbox"
                        checked={resetAcknowledged}
                        onChange={(event) => setResetAcknowledged(event.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-red-700"
                    />
                    I understand that this cannot be undone.
                </label>
                <label className="mt-5 block text-sm font-semibold text-red-950">
                    Type DELETE JOURNEYS to confirm
                    <input
                        value={resetConfirmation}
                        onChange={(event) => setResetConfirmation(event.target.value)}
                        disabled={!resetAcknowledged}
                        className="mt-2 w-full border border-red-200 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 disabled:bg-red-100/60"
                    />
                </label>
                <button
                    type="button"
                    disabled={!resetAcknowledged || resetConfirmation !== "DELETE JOURNEYS" || isLoading}
                    onClick={resetJourneys}
                    className="mt-5 w-full bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                    Delete all journeys
                </button>
            </section>

            {message && <p className="text-sm font-semibold text-emerald-700 lg:col-span-2">{message}</p>}
            {error && <p className="text-sm font-semibold text-red-700 lg:col-span-2">{error}</p>}
        </section>
    );
}
