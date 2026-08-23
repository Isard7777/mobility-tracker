// Liste des participants au défi, éditée manuellement (pas de gestion en base).
export const PARTICIPANTS = [
  "Alice",
  "Benoit",
  "Chloé",
  "David",
  "Emma",
] as const;

export type Participant = (typeof PARTICIPANTS)[number];
