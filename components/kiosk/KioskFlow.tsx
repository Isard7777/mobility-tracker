"use client";

import { useEffect, useRef, useState } from "react";
import { PARTICIPANTS, type Participant } from "@/config/participants";
import type { ModeId } from "@/config/modes";
import { ParticipantSearch } from "@/components/kiosk/ParticipantSearch";
import { ModeSelector } from "@/components/kiosk/ModeSelector";
import { NumericKeypad } from "@/components/kiosk/NumericKeypad";
import { ConfirmationScreen } from "@/components/kiosk/ConfirmationScreen";
import { ContextBanner } from "@/components/kiosk/ContextBanner";
import type { Totals } from "@/lib/totals";

type Step = "name" | "mode" | "km" | "confirm";

type KioskFlowProps = {
    initialTotals: Totals;
    showIndividualWeeklyCo2: boolean;
};

const INACTIVITY_RESET_MS = 30_000;
const CONFIRMATION_DISPLAY_MS = 3_000;

function getToday(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

export function KioskFlow({ initialTotals, showIndividualWeeklyCo2 }: KioskFlowProps) {
    const [step, setStep] = useState<Step>("name");
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);
    const [kmInput, setKmInput] = useState("");
    const [entryDate, setEntryDate] = useState(getToday);
    const [carpoolOccupants, setCarpoolOccupants] = useState(2);
    const [lastEntryCo2, setLastEntryCo2] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totals, setTotals] = useState<Totals>(initialTotals);

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function refreshTotals() {
        try {
            const url = showIndividualWeeklyCo2 ? "/api/totals?includeIndividualWeeklyCo2=true" : "/api/totals";
            const res = await fetch(url);
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
        setEntryDate(getToday());
        setCarpoolOccupants(2);
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

    useEffect(() => {
        const streamUrl = showIndividualWeeklyCo2 ? "/api/stream?includeIndividualWeeklyCo2=true" : "/api/stream";
        const stream = new EventSource(streamUrl);
        const updateTotals = (event: MessageEvent<string>) => {
            try {
                const payload = JSON.parse(event.data) as { totals: Totals };
                setTotals(payload.totals);
            } catch {
                // Ignore malformed stream messages and wait for the next update.
            }
        };

        stream.addEventListener("totals", updateTotals);
        stream.addEventListener("update", updateTotals);
        return () => stream.close();
    }, [showIndividualWeeklyCo2]);

    function handleParticipantSelect(participant: Participant) {
        setSelectedParticipant(participant);
        setStep("mode");
    }

    function handleModeSelect(mode: ModeId) {
        setSelectedMode(mode);
        setStep("km");
    }

    function handleBack() {
        if (step === "mode") {
            setSelectedParticipant(null);
            setStep("name");
            return;
        }
        if (step === "km") {
            setSelectedMode(null);
            setKmInput("");
            setStep("mode");
        }
    }

    async function handleValidate() {
        if (!selectedParticipant || !selectedMode || isSubmitting) return;
        const km = Number(kmInput.replace(",", "."));
        if (!(km > 0 && Number.isFinite(km))) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quadrigram: selectedParticipant.quadrigram,
                    mode: selectedMode,
                    oneWayKm: km,
                    entryDate,
                    ...(selectedMode === "carpool" ? { carpoolOccupants } : {}),
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
    const isKmValid = km > 0 && Number.isFinite(km) && !isSubmitting;

    return (
        <div className="relative flex h-dvh w-dvw flex-col overflow-hidden bg-[#f6fbf4] text-[#17351f]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-75"
                style={{ backgroundImage: "url('/images/ralf1403-flower-meadow-7955256.jpg')" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-white/20"
            />
            <div className="relative z-10 flex-1 overflow-hidden">
                {step === "name" && (
                    <ParticipantSearch
                        participants={PARTICIPANTS}
                        weeklyCo2ByQuadrigram={totals.weeklyCo2ByQuadrigram}
                        onSelect={handleParticipantSelect}
                    />
                )}
                {step === "mode" && (
                    <ModeSelector
                        onSelect={handleModeSelect}
                        onBack={handleBack}
                        onCancel={resetFlow}
                    />
                )}
                {step === "km" && (
                    <NumericKeypad
                        value={kmInput}
                        onChange={setKmInput}
                        onValidate={handleValidate}
                        isValid={isKmValid}
                        entryDate={entryDate}
                        onEntryDateChange={setEntryDate}
                        carpoolOccupants={selectedMode === "carpool" ? carpoolOccupants : undefined}
                        onCarpoolOccupantsChange={setCarpoolOccupants}
                        onBack={handleBack}
                        onCancel={resetFlow}
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
                totalCo2SavedKg={totals.totalCo2SavedKg}
                participantsCount={totals.participantsCount}
            />
        </div>
    );
}
