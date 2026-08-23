"use client";

import { useEffect, useRef, useState } from "react";
import { PARTICIPANTS } from "@/config/participants";
import type { ModeId } from "@/config/modes";
import { NameGrid } from "@/components/kiosk/NameGrid";
import { ModeSelector } from "@/components/kiosk/ModeSelector";
import { NumericKeypad } from "@/components/kiosk/NumericKeypad";
import { ConfirmationScreen } from "@/components/kiosk/ConfirmationScreen";
import { ContextBanner } from "@/components/kiosk/ContextBanner";
import { addKioskEntry, getKioskTotals, type KioskTotals } from "@/lib/kiosk-store";

type Step = "name" | "mode" | "km" | "confirm";

const INACTIVITY_RESET_MS = 30_000;
const CONFIRMATION_DISPLAY_MS = 3_000;
const MAX_KM = 200;

export default function KioskPage() {
  const [step, setStep] = useState<Step>("name");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<ModeId | null>(null);
  const [kmInput, setKmInput] = useState("");
  const [lastEntryCo2, setLastEntryCo2] = useState(0);
  const [totals, setTotals] = useState<KioskTotals>(() => getKioskTotals());

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetFlow() {
    setStep("name");
    setSelectedName(null);
    setSelectedMode(null);
    setKmInput("");
  }

  // Reset le formulaire après 30s d'inactivité en cours de saisie (pas sur l'écran d'accueil).
  useEffect(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (step === "name") return;

    inactivityTimer.current = setTimeout(resetFlow, INACTIVITY_RESET_MS);
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [step, selectedName, selectedMode, kmInput]);

  useEffect(() => {
    if (step !== "confirm") return;
    const timer = setTimeout(resetFlow, CONFIRMATION_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [step]);

  function handleNameSelect(name: string) {
    setSelectedName(name);
    setStep("mode");
  }

  function handleModeSelect(mode: ModeId) {
    setSelectedMode(mode);
    setStep("km");
  }

  function handleValidate() {
    if (!selectedName || !selectedMode) return;
    const km = Number(kmInput.replace(",", "."));
    if (!(km > 0 && km <= MAX_KM)) return;

    const entry = addKioskEntry(selectedName, selectedMode, km);
    setLastEntryCo2(entry.co2SavedKg);
    setTotals(getKioskTotals());
    setStep("confirm");
  }

  const km = Number(kmInput.replace(",", "."));
  const isKmValid = km > 0 && km <= MAX_KM;

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden bg-neutral-950">
      <div className="flex-1 overflow-hidden">
        {step === "name" && <NameGrid names={PARTICIPANTS} onSelect={handleNameSelect} />}
        {step === "mode" && <ModeSelector onSelect={handleModeSelect} />}
        {step === "km" && (
          <NumericKeypad
            value={kmInput}
            onChange={setKmInput}
            onValidate={handleValidate}
            isValid={isKmValid}
          />
        )}
        {step === "confirm" && selectedName && (
          <ConfirmationScreen
            name={selectedName}
            co2SavedKg={lastEntryCo2}
            onDismiss={resetFlow}
          />
        )}
      </div>
      <ContextBanner totalKm={totals.totalKm} participantsCount={totals.participantsCount} />
    </div>
  );
}
