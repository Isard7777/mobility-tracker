import { motion } from "framer-motion";

type ConfirmationScreenProps = {
    name: string;
    co2SavedKg: number;
    onDismiss: () => void;
};

export function ConfirmationScreen({ name, co2SavedKg, onDismiss }: ConfirmationScreenProps) {
    return (
        <button
            type="button"
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
            <p className="text-2xl">+{co2SavedKg.toFixed(2)} kg of CO2 saved</p>
        </button>
    );
}
