export const MODES = [
  { id: "velo", label: "Vélo", emoji: "🚴" },
  { id: "marche", label: "Marche", emoji: "🚶" },
  { id: "bus", label: "Bus", emoji: "🚌" },
  { id: "train", label: "Train", emoji: "🚆" },
  { id: "tram", label: "Tram", emoji: "🚊" },
  { id: "vae", label: "Vélo électrique", emoji: "🔋" },
  { id: "covoiturage", label: "Covoiturage", emoji: "🚗" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];
