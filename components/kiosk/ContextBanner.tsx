type ContextBannerProps = {
  totalKm: number;
  participantsCount: number;
};

export function ContextBanner({ totalKm, participantsCount }: ContextBannerProps) {
  return (
    <div className="flex h-[10vh] w-full items-center justify-center gap-8 bg-neutral-900 text-neutral-400">
      <span className="text-lg">
        {totalKm.toFixed(0)} km covered together
      </span>
      <span className="text-lg">·</span>
      <span className="text-lg">{participantsCount} participant(s)</span>
    </div>
  );
}
