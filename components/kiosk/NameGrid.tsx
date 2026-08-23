type NameGridProps = {
  names: readonly string[];
  onSelect: (name: string) => void;
};

export function NameGrid({ names, onSelect }: NameGridProps) {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-4 p-6 sm:grid-cols-4">
      {names.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect(name)}
          className="flex items-center justify-center rounded-2xl bg-neutral-800 text-3xl font-semibold text-white shadow-lg transition active:scale-95 active:bg-emerald-600"
        >
          {name}
        </button>
      ))}
    </div>
  );
}
