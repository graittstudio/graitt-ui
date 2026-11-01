/**
 * Gedeelde stijl voor de Play Store-bouwstenen. Net als `JuridischeLinks` via
 * de `--grait-*`-variabelen met terugvalwaarden, zodat ze ook werken in een
 * app zonder de Tailwind-preset.
 */

export const KAART = {
  background: "var(--grait-card, #ffffff)",
  color: "var(--grait-card-foreground, #111b28)",
  border: "1px solid var(--grait-border, #dcd7cd)",
  borderRadius: "var(--grait-radius, 1.1rem)",
  padding: "1rem",
} as const;

export const ACHTERGROND = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  background: "rgba(0,0,0,0.4)",
  padding: "1rem",
  // ruimte voor de navigatiebalk van de telefoon (rand-tot-rand, API 35+)
  paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
} as const;

export const VENSTER = {
  ...KAART,
  width: "100%",
  maxWidth: "26rem",
  maxHeight: "calc(100dvh - 2rem)",
  overflowY: "auto",
} as const;

export const KLEIN = {
  margin: "0.5rem 0 0",
  fontSize: "0.85rem",
  color: "var(--grait-muted-foreground, #565e69)",
} as const;

const KNOP = {
  minHeight: "44px",
  padding: "0.5rem 1rem",
  borderRadius: "var(--grait-radius, 1.1rem)",
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",
  flex: 1,
} as const;

export const KNOP_HOOFD = {
  ...KNOP,
  border: "none",
  background: "var(--grait-primary, #152a43)",
  color: "var(--grait-primary-foreground, #fdf8ed)",
} as const;

export const KNOP_GEVAAR = {
  ...KNOP,
  border: "none",
  background: "var(--grait-destructive, #df202e)",
  color: "var(--grait-destructive-foreground, #fdf3f3)",
} as const;

export const KNOP_RUSTIG = {
  ...KNOP,
  border: "1px solid var(--grait-border, #dcd7cd)",
  background: "transparent",
  color: "inherit",
} as const;

export const RIJ = { display: "flex", gap: "0.5rem", marginTop: "1rem" } as const;
