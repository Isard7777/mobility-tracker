// Roster of challenge participants, edited manually (not stored in the database).
// Identified by a four-letter employee code ("quadrigram"), e.g. first initial + 3 letters of last name.
export type Participant = {
  quadrigram: string;
  displayName: string;
};

export const PARTICIPANTS: Participant[] = [
  { quadrigram: "ADUP", displayName: "Alice Dupont" },
  { quadrigram: "BLEF", displayName: "Benoit Lefevre" },
  { quadrigram: "CMAR", displayName: "Chloe Martin" },
  { quadrigram: "DBER", displayName: "David Bernard" },
  { quadrigram: "EROU", displayName: "Emma Roux" },
  { quadrigram: "FPET", displayName: "Fabien Petit" },
  { quadrigram: "GMOR", displayName: "Gaelle Moreau" },
  { quadrigram: "HSIM", displayName: "Hugo Simon" },
];
