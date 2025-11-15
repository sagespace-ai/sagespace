// Rune Symbol System for Sage Avatars
// 12 distinct cosmic glyphs for the rotating halo

export const RUNE_IDS = [
  "rune-compass",
  "rune-spiral",
  "rune-eye",
  "rune-triad",
  "rune-key",
  "rune-flame",
  "rune-wave",
  "rune-axis",
  "rune-crescent",
  "rune-fracture",
  "rune-orbit",
  "rune-gate",
] as const;

export type RuneId = (typeof RUNE_IDS)[number];

// SVG path data for each rune (abstract mystical symbols)
export const RUNE_PATHS: Record<RuneId, string> = {
  "rune-compass": "M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10Z M12 8A4 4 0 1012 16A4 4 0 0012 8",
  "rune-spiral": "M12 2C12 2 8 4 6 8C4 12 6 16 12 16C18 16 20 12 18 8C16 4 12 6 12 10C12 14 14 14 14 12",
  "rune-eye": "M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z M12 9A3 3 0 1012 15A3 3 0 0012 9",
  "rune-triad": "M12 2L22 22L2 22Z M12 8L17 18L7 18Z",
  "rune-key": "M12 2A6 6 0 1012 14L12 22 M9 19L15 19 M12 8A2 2 0 1012 12",
  "rune-flame": "M12 2C10 6 8 10 10 14C11 16 13 16 14 14C16 10 14 6 12 2Z M12 10C11 12 11 14 12 15C13 14 13 12 12 10Z",
  "rune-wave": "M2 12C4 8 6 8 8 12C10 16 12 16 14 12C16 8 18 8 20 12C22 16 22 16 22 16",
  "rune-axis": "M2 12L22 12 M12 2L12 22 M6 6L18 18 M18 6L6 18",
  "rune-crescent": "M12 2A10 10 0 0012 22A8 8 0 1012 2Z",
  "rune-fracture": "M2 2L12 12L22 2 M2 22L12 12L22 22 M12 2L12 22",
  "rune-orbit": "M12 12m-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0 M12 6A6 6 0 1012 18A6 6 0 0012 6 M12 9A3 3 0 1012 15A3 3 0 0012 9",
  "rune-gate": "M4 2L4 22 M20 2L20 22 M4 8L20 8 M4 16L20 16 M8 2L8 22 M16 2L16 22",
};

// Get a random rune ID
export const getRandomRune = (): RuneId => {
  return RUNE_IDS[Math.floor(Math.random() * RUNE_IDS.length)];
};

// Get runes for a specific evolution stage
export const getRunesForStage = (stage: number): RuneId[] => {
  const count = stage === 1 ? 4 : stage === 2 ? 8 : stage === 3 ? 12 : 16;
  const runes: RuneId[] = [];
  
  for (let i = 0; i < count; i++) {
    runes.push(RUNE_IDS[i % RUNE_IDS.length]);
  }
  
  return runes;
};
