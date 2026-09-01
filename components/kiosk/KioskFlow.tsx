"use client";

import { useEffect, useRef, useState } from "react";
import { PARTICIPANTS, type Participant } from "@/config/participants";
import type { ModeId } from "@/config/modes";
import { ParticipantSearch } from "@/components/kiosk/ParticipantSearch";
import { ModeSelector } from "@/components/kiosk/ModeSelector";
import { NumericKeypad } from "@/components/kiosk/NumericKeypad";
import { ConfirmationScreen } from "@/components/kiosk/ConfirmationScreen";
import { ContextBanner } from "@/components/kiosk/ContextBanner";

type Step = "name" | "mode" | "km" | "confirm";

type Totals = {
    totalKm: number;
    totalCo2SavedKg: number;
    participantsCount: number;
};

type KioskFlowProps = {
    initialTotals: Totals;
};

const INACTIVITY_RESET_MS = 30_000;
const CONFIRMATION_DISPLAY_MS = 3_000;
const MAX_KM = 200;

export function KioskFlow({ initialTotals }: KioskFlowProps) {
    const [step, setStep] = useState<Step>("name");
    const [selectedParticipant, setSelectedParticipant] =
        useState<Participant | null>(null);
    const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);
    const [kmInput, setKmInput] = useState("");
    const [lastEntryCo2, setLastEntryCo2] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totals, setTotals] = useState<Totals>(initialTotals);

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function refreshTotals() {
        try {
            const res = await fetch("/api/totals");
            if (!res.ok) return;
            setTotals(await res.json());
        } catch {
            // Non-critical: the banner just keeps its last known value.
        }
    }

    function resetFlow() {
        setStep("name");
        setSelectedParticipant(null);
        setSelectedMode(null);
        setKmInput("");
    }

    // Resets the form after 30s of inactivity mid-entry (not on the idle name search screen).
    useEffect(() => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (step === "name") return;

        inactivityTimer.current = setTimeout(resetFlow, INACTIVITY_RESET_MS);
        return () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        };
    }, [step, selectedParticipant, selectedMode, kmInput]);

    useEffect(() => {
        if (step !== "confirm") return;
        const timer = setTimeout(resetFlow, CONFIRMATION_DISPLAY_MS);
        return () => clearTimeout(timer);
    }, [step]);

    function handleParticipantSelect(participant: Participant) {
        setSelectedParticipant(participant);
        setStep("mode");
    }

    function handleModeSelect(mode: ModeId) {
        setSelectedMode(mode);
        setStep("km");
    }

    async function handleValidate() {
        if (!selectedParticipant || !selectedMode || isSubmitting) return;
        const km = Number(kmInput.replace(",", "."));
        if (!(km > 0 && km <= MAX_KM)) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quadrigram: selectedParticipant.quadrigram,
                    mode: selectedMode,
                    km,
                    source: "kiosk",
                }),
            });
            if (!res.ok) return;

            const entry: { co2SavedKg: number } = await res.json();
            setLastEntryCo2(entry.co2SavedKg);
            await refreshTotals();
            setStep("confirm");
        } catch {
            // Stay on the km screen so the person can retry.
        } finally {
            setIsSubmitting(false);
        }
    }

    const km = Number(kmInput.replace(",", "."));
    const isKmValid = km > 0 && km <= MAX_KM && !isSubmitting;

    return (
        <div className="flex h-dvh w-dvw flex-col overflow-hidden bg-neutral-950">
            <div className="flex-1 overflow-hidden">
                {step === "name" && (
                    <ParticipantSearch
                        participants={PARTICIPANTS}
                        onSelect={handleParticipantSelect}
                    />
                )}
                {step === "mode" && (
                    <ModeSelector onSelect={handleModeSelect} />
                )}
                {step === "km" && (
                    <NumericKeypad
                        value={kmInput}
                        onChange={setKmInput}
                        onValidate={handleValidate}
                        isValid={isKmValid}
                    />
                )}
                {step === "confirm" && selectedParticipant && (
                    <ConfirmationScreen
                        name={selectedParticipant.displayName.split(" ")[0]}
                        co2SavedKg={lastEntryCo2}
                        onDismiss={resetFlow}
                    />
                )}
            </div>
            <ContextBanner
                totalKm={totals.totalKm}
                participantsCount={totals.participantsCount}
            />
        </div>
    );
}
