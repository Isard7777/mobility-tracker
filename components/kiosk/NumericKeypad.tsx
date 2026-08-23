import { KioskNavigation } from "@/components/kiosk/KioskNavigation";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

type NumericKeypadProps = {
    value: string;
    onChange: (value: string) => void;
    onValidate: () => void;
    isValid: boolean;
    entryDate: string;
    onEntryDateChange: (entryDate: string) => void;
    carpoolOccupants?: number;
    onCarpoolOccupantsChange: (occupants: number) => void;
    onBack: () => void;
    onCancel: () => void;
};

export function NumericKeypad({
    value,
    onChange,
    onValidate,
    isValid,
    entryDate,
    onEntryDateChange,
    carpoolOccupants,
    onCarpoolOccupantsChange,
    onBack,
    onCancel,
}: NumericKeypadProps) {
    function pressKey(key: string) {
        if (key === "⌫") {
            onChange(value.slice(0, -1));
            return;
        }
        if (key === "," && value.includes(",")) return;
        if (value.includes(",") && value.split(",")[1].length >= 2) return;
        onChange(value + key);
    }

    const isCarpool = carpoolOccupants !== undefined;
    const km = Number(value.replace(",", "."));

    return (
        <div className="relative flex h-full w-full flex-col items-center gap-3 px-6 pt-16 pb-3">
            <KioskNavigation
                onBack={onBack}
                onCancel={onCancel}
            />
            <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-base font-semibold text-emerald-950">
                    Journey date
                    <input
                        type="date"
                        value={entryDate}
                        onChange={(event) => onEntryDateChange(event.target.value)}
                        className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-lg font-medium shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </label>
                {isCarpool && (
                    <div className="flex flex-col gap-1 text-base font-semibold text-emerald-950">
                        Carpool occupants
                        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-1 shadow-sm">
                            <button
                                type="button"
                                aria-label="Remove carpool occupant"
                                disabled={carpoolOccupants <= 2}
                                onClick={() => onCarpoolOccupantsChange(carpoolOccupants - 1)}
                                className="h-10 w-10 rounded-lg text-2xl font-medium text-emerald-800 transition active:scale-95 disabled:text-emerald-200"
                            >
                                −
                            </button>
                            <span className="text-xl text-emerald-950">{carpoolOccupants}</span>
                            <button
                                type="button"
                                aria-label="Add carpool occupant"
                                disabled={carpoolOccupants >= 8}
                                onClick={() => onCarpoolOccupantsChange(carpoolOccupants + 1)}
                                className="h-10 w-10 rounded-lg text-2xl font-medium text-emerald-800 transition active:scale-95 disabled:text-emerald-200"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="rounded-2xl bg-emerald-800 px-8 py-2 text-5xl font-bold text-white shadow-lg shadow-emerald-900/15">
                {value || "0"} <span className="text-2xl text-emerald-100">km</span>
            </div>
            <p className="text-base font-medium text-emerald-950/75">
                One-way distance{km > 0 ? ` · ${Math.round(km * 2 * 100) / 100} km round trip` : ""}
            </p>

            <div className="grid grid-cols-3 gap-3">
                {KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => pressKey(key)}
                        className="h-16 w-16 rounded-xl border border-emerald-100 bg-white text-2xl font-semibold text-emerald-950 shadow-sm transition active:scale-95 active:bg-emerald-100"
                    >
                        {key}
                    </button>
                ))}
            </div>

            <button
                type="button"
                disabled={!isValid}
                onClick={onValidate}
                className="w-full max-w-xs rounded-xl bg-emerald-700 py-3 text-xl font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-95 disabled:cursor-not-allowed disabled:bg-emerald-100 disabled:text-emerald-800/45"
            >
                Confirm
            </button>
        </div>
    );
}
