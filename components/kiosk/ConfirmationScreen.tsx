import { motion } from "framer-motion";

type ConfirmationScreenProps = {
    name: string;
    co2SavedKg: number;
    onDismiss: () => void;
    onEdit?: () => void;
};

export function ConfirmationScreen({ name, co2SavedKg, onDismiss, onEdit }: ConfirmationScreenProps) {
    return (
        <div
            onClick={onDismiss}
            className="flex h-full w-full flex-col items-center justify-center gap-6 bg-emerald-700 text-white"
        >
            <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-8xl"
            >
                🎉
            </motion.span>
            <p className="text-4xl font-bold">Thank you {name}!</p>
            <p className="text-2xl">{co2SavedKg.toFixed(2)} kg of CO2 saved</p>
            {onEdit && (
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit();
                    }}
                    className="mt-2 rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white/90 transition active:scale-95 active:bg-white/10"
                >
                    Made a mistake? Fix the distance
                </button>
            )}
        </div>
    );
}
