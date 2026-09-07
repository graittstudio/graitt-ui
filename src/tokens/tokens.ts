/**
 * Zelfde waarden als tokens.css, als JS/TS-object — voor plekken waar geen
 * CSS-variabelen beschikbaar zijn (recharts-vullingen, PDF-export via jsPDF).
 * Bij een wijziging: hier én in tokens.css aanpassen, dit bestand leidt niet.
 */

export const tokens = {
  radius: "1.1rem",

  background: "#f6f1e7",
  foreground: "#111b28",
  card: "#ffffff",
  cardForeground: "#111b28",

  primary: "#152a43",
  primaryForeground: "#fdf8ed",
  secondary: "#5a7d46",
  secondaryForeground: "#fbf8f1",
  accent: "#e1791b",
  accentForeground: "#281606",

  muted: "#ebe7df",
  mutedForeground: "#565e69",
  border: "#dcd7cd",
  input: "#e6e1d6",
  ring: "#3a577a",

  surface: "#fcf8f0",
  surface2: "#f0ebe0",

  destructive: "#df202e",
  destructiveForeground: "#fdf3f3",
  warn: "#f2a618",
  warnForeground: "#281a06",
  success: "#488055",
  successForeground: "#f3f8f4",
} as const;

/**
 * Categoriekleuren voor de kostenmodule-donut. brandstof/onderhoud/overig
 * zijn 1:1 uit TravelCampGo's bestaande CATS (kosten.index.tsx) - de rest
 * (reparatie/banden/verzekering/wegenbelasting/keuring/stalling) bestaat
 * nog niet in TravelCampGo en is hier voor het eerst gekozen, afgestemd op
 * de rest van het palet.
 */
export const categorieKleuren = {
  brandstof: "#e07a3c",
  onderhoud: "#828282",
  reparatie: "#c94a7a",
  banden: "#7a5cff",
  verzekering: "#4aa1c9",
  wegenbelasting: "#1f6b46",
  keuring: "#a3733c",
  stalling: "#6b7d8f",
  camping: "#1f6b46",
  tol: "#7a5cff",
  boodschappen: "#4aa1c9",
  restaurant: "#c94a7a",
  overig: "#a3a3a3",
} as const;

export type Tokens = typeof tokens;
export type CategorieKleur = keyof typeof categorieKleuren;
