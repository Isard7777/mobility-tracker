import { MODES, type ModeId } from "@/config/modes";

type ModeSelectorProps = {
    onSelect: (mode: ModeId) => void;
};

export function ModeSelector({ onSelect }: ModeSelectorProps) {
    return (
        <div className="grid h-full w-full grid-cols-2 gap-4 p-6 sm:grid-cols-3">
            {MODES.map((mode) => (
                <button
                    key={mode.id}
                    type="button"
                    onClick={() => onSelect(mode.id)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-800 text-white shadow-lg transition active:scale-95 active:bg-emerald-600"
                >
                    <span className="text-5xl">{mode.emoji}</span>
                    <span className="text-xl font-semibold">{mode.label}</span>
                </button>
            ))}
        </div>
    );
}
