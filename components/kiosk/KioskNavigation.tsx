import { ArrowLeft, X } from "lucide-react";

type KioskNavigationProps = {
    onBack: () => void;
    onCancel: () => void;
};

export function KioskNavigation({ onBack, onCancel }: KioskNavigationProps) {
    return (
        <div className="absolute top-4 left-6 z-10 flex gap-3">
            <button
                type="button"
                aria-label="Go back"
                title="Go back"
                onClick={onBack}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-white/95 text-emerald-900 shadow-sm transition active:scale-95"
            >
                <ArrowLeft
                    aria-hidden="true"
                    size={28}
                />
            </button>
            <button
                type="button"
                aria-label="Cancel entry"
                title="Cancel entry"
                onClick={onCancel}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-white/95 text-emerald-900 shadow-sm transition active:scale-95"
            >
                <X
                    aria-hidden="true"
                    size={28}
                />
            </button>
        </div>
    );
}
