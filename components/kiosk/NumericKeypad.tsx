const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"];

type NumericKeypadProps = {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
  isValid: boolean;
};

export function NumericKeypad({ value, onChange, onValidate, isValid }: NumericKeypadProps) {
  function pressKey(key: string) {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "," && value.includes(",")) return;
    if (value.replace(",", "").length >= 5) return;
    onChange(value + key);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-6">
      <div className="rounded-2xl bg-neutral-800 px-10 py-4 text-6xl font-bold text-white">
        {value || "0"} <span className="text-3xl text-neutral-400">km</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pressKey(key)}
            className="h-20 w-20 rounded-2xl bg-neutral-800 text-3xl font-semibold text-white shadow-lg transition active:scale-95 active:bg-neutral-600"
          >
            {key}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!isValid}
        onClick={onValidate}
        className="w-full max-w-xs rounded-2xl bg-emerald-600 py-4 text-2xl font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500 active:scale-95"
      >
        Confirm
      </button>
    </div>
  );
}
