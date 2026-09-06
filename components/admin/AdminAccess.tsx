"use client";

import { Database, Download, FileBarChart2, LockKeyhole, LogIn, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminControls } from "@/components/admin/AdminControls";

const exports = [
    {
        group: "date",
        icon: FileBarChart2,
        title: "By date",
        description: "One row per journey date with total kilometres and CO2 saved.",
    },
    {
        group: "user",
        icon: Users,
        title: "By participant",
        description: "One row per employee with total journeys, kilometres, and CO2 saved.",
    },
    {
        group: "mode",
        icon: Download,
        title: "By transport mode",
        description: "One row per sustainable transport mode with collective totals.",
    },
    {
        group: "entries",
        icon: Database,
        title: "All journey data",
        description:
            "One row per recorded journey with all available fields, including date, participant, mode, and kilometres.",
    },
] as const;

function basicAuthorization(password: string): string {
    return `Basic ${btoa(`admin:${password}`)}`;
}

export function AdminAccess() {
    const [password, setPassword] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function unlock(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/admin/participants", {
                headers: { Authorization: basicAuthorization(password) },
            });
            if (!response.ok) throw new Error("The admin password was not accepted.");
            setIsUnlocked(true);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not unlock administration.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function downloadCsv(group: (typeof exports)[number]["group"]) {
        setError("");
        try {
            const response = await fetch(`/api/admin/exports/${group}`, {
                headers: { Authorization: basicAuthorization(password) },
            });
            if (!response.ok) throw new Error("The CSV export could not be downloaded.");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `mobility-tracker-by-${group}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The CSV export could not be downloaded.");
        }
    }

    if (!isUnlocked) {
        return (
            <section className="mx-auto mt-16 max-w-md border border-white/30 bg-white/95 p-8 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center bg-emerald-800 text-white">
                    <LockKeyhole
                        aria-hidden="true"
                        size={24}
                    />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-emerald-950">Administrator access</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-950/70">
                    Enter the administrator password to access exports, roster management, and destructive actions.
                </p>
                <form
                    className="mt-6"
                    onSubmit={unlock}
                >
                    <label className="block text-sm font-semibold text-emerald-950">
                        Admin password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            autoFocus
                            className="mt-2 w-full border border-emerald-200 bg-white px-3 py-3 text-base outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                        />
                    </label>
                    {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting || password.length === 0}
                        className="mt-6 flex w-full items-center justify-center gap-2 bg-emerald-700 px-4 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                        <LogIn
                            aria-hidden="true"
                            size={18}
                        />
                        {isSubmitting ? "Unlocking..." : "Unlock administration"}
                    </button>
                </form>
            </section>
        );
    }

    return (
        <>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {exports.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.group}
                            type="button"
                            onClick={() => downloadCsv(item.group)}
                            className="group border border-emerald-200 bg-white p-6 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50"
                        >
                            <Icon
                                aria-hidden="true"
                                size={28}
                                className="text-emerald-700"
                            />
                            <h2 className="mt-6 text-xl font-bold text-emerald-950">{item.title}</h2>
                            <p className="mt-2 min-h-20 text-sm leading-6 text-emerald-950/70">{item.description}</p>
                            <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                <Download
                                    aria-hidden="true"
                                    size={18}
                                />
                                Download CSV
                            </span>
                        </button>
                    );
                })}
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
            <AdminControls password={password} />
        </>
    );
}
