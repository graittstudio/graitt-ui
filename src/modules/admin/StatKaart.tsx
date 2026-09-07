import type { ReactNode } from "react";

export interface StatKaartProps {
  label: ReactNode;
  waarde: ReactNode;
  subtekst?: ReactNode;
  /** Randkleur, standaard var(--grait-border) - geef een eigen hex/CSS-kleur mee om aan te sluiten bij het kleurenpalet van de consumerende app. */
  randKleur?: string;
}

/**
 * Eén statistiek-kaartje (#166, gedistilleerd uit TravelCareGo's
 * AdminScherm.tsx - #19). Puur presentationeel, geen data-ophalen: de
 * consumerende app berekent de cijfers zelf (server-side, zie de
 * admin-statistieken-achtige Edge Function in TravelCareGo als voorbeeld).
 */
export function StatKaart({ label, waarde, subtekst, randKleur }: StatKaartProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "9rem",
        border: `1px solid ${randKleur ?? "var(--grait-border)"}`,
        borderRadius: "0.6rem",
        padding: "0.6rem 0.8rem",
      }}
    >
      <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>{waarde}</div>
      <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{label}</div>
      {subtekst && <div style={{ fontSize: "0.68rem", opacity: 0.55, marginTop: "0.15rem" }}>{subtekst}</div>}
    </div>
  );
}
