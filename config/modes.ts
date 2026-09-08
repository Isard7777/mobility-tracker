export const MODES = [
    { id: "ebike", label: "E-bike", emoji: "🚲⚡" },
    { id: "bike", label: "Bike", emoji: "🚴" },
    { id: "walk", label: "Walk", emoji: "🚶" },
    { id: "bus", label: "Bus", emoji: "🚌" },
    { id: "train", label: "Train", emoji: "🚆" },
    { id: "tram", label: "Tram", emoji: "🚊" },
    { id: "carpool", label: "Carpool", emoji: "🚗" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];
