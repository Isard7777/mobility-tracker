import { Leaf } from "lucide-react";

type ContextBannerProps = {
    totalKm: number;
    totalCo2SavedKg: number;
    participantsCount: number;
};

export function ContextBanner({ totalKm, totalCo2SavedKg, participantsCount }: ContextBannerProps) {
    return (
        <div className="relative z-10 flex h-[10vh] w-full items-center justify-center gap-4 border-t border-emerald-200 bg-white/90 text-base text-emerald-900 backdrop-blur-sm sm:gap-8 sm:text-lg">
            <span>{totalKm.toFixed(0)} km covered together</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Leaf
                    aria-hidden="true"
                    size={18}
                />
                {totalCo2SavedKg.toFixed(1)} kg CO2 saved
            </span>
            <span>·</span>
            <span>{participantsCount} participant(s)</span>
        </div>
    );
}
