import { MODES, type ModeId } from "@/config/modes";
import { KioskNavigation } from "@/components/kiosk/KioskNavigation";

type ModeSelectorProps = {
    onSelect: (mode: ModeId) => void;
    onBack: () => void;
    onCancel: () => void;
};

export function ModeSelector({ onSelect, onBack, onCancel }: ModeSelectorProps) {
    return (
        <div className="relative h-full w-full">
            <KioskNavigation
                onBack={onBack}
                onCancel={onCancel}
            />
            <div className="grid h-full w-full grid-cols-2 gap-4 px-6 pt-20 pb-6 sm:grid-cols-3">
                {MODES.map((mode) => (
                    <button
                        key={mode.id}
                        type="button"
                        onClick={() => onSelect(mode.id)}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border text-emerald-950 shadow-sm transition active:scale-95 active:border-emerald-600 active:bg-emerald-600 active:text-white ${
                            mode.id === "ebike"
                                ? "border-lime-500 bg-lime-50 shadow-md ring-2 ring-lime-300/70"
                                : "border-emerald-100 bg-white"
                        }`}
                    >
                        <span className="text-5xl">{mode.emoji}</span>
                        <span className="text-xl font-semibold">{mode.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
