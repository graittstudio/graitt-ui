import { useState, type ReactNode } from "react";

export interface GebruikersTabelKolom<TRij> {
  /** Kolomkop, bv. "Voertuigen" of "Proefperiode". */
  label: ReactNode;
  /** Rendert de celinhoud voor deze rij. */
  render: (rij: TRij) => ReactNode;
}

export interface GebruikersTabelProps<TRij extends { id: string; email: string; tier: string }> {
  rijen: TRij[];
  /** Extra kolommen tussen e-mail en tier-select, bv. voertuigaantal/proefperiode - app-specifiek, dus als render-functie meegegeven. */
  kolommen?: Array<GebruikersTabelKolom<TRij>>;
  /** Beschikbare tiers + hun label, in weergavevolgorde, bv. [{waarde:"gratis",label:"Gratis"}, ...]. */
  tiers: Array<{ waarde: string; label: string }>;
  /** Aangeroepen zodra de admin een andere tier kiest voor een rij - de consumerende app regelt zelf het opslaan (Edge Function/RLS). */
  onWijzigTier: (rijId: string, tier: string) => void | Promise<void>;
  kolomEmailLabel?: string;
  kolomTierLabel?: string;
}

/**
 * Gebruikerslijst met tier-wijzigen (#166, gedistilleerd uit TravelCareGo's
 * AdminScherm.tsx - #18). Puur presentationeel: geen data-ophalen, geen
 * eigen toegangscontrole - dat blijft de verantwoordelijkheid van de
 * consumerende app (server-side, vaste e-maillijst of rollen-systeem, zie
 * de toelichting in TravelCareGo's admin-gebruikers Edge Function).
 */
export function GebruikersTabel<TRij extends { id: string; email: string; tier: string }>({
  rijen,
  kolommen = [],
  tiers,
  onWijzigTier,
  kolomEmailLabel = "E-mailadres",
  kolomTierLabel = "Abonnement",
}: GebruikersTabelProps<TRij>) {
  const [bezigId, setBezigId] = useState<string | undefined>();

  async function wijzig(rijId: string, tier: string) {
    setBezigId(rijId);
    await onWijzigTier(rijId, tier);
    setBezigId(undefined);
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--grait-border)" }}>
            <th style={{ padding: "0.5rem 0.6rem" }}>{kolomEmailLabel}</th>
            {kolommen.map((k, i) => (
              <th key={i} style={{ padding: "0.5rem 0.6rem" }}>
                {k.label}
              </th>
            ))}
            <th style={{ padding: "0.5rem 0.6rem" }}>{kolomTierLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rijen.map((rij) => (
            <tr key={rij.id} style={{ borderBottom: "1px solid var(--grait-border)" }}>
              <td style={{ padding: "0.5rem 0.6rem" }}>{rij.email}</td>
              {kolommen.map((k, i) => (
                <td key={i} style={{ padding: "0.5rem 0.6rem" }}>
                  {k.render(rij)}
                </td>
              ))}
              <td style={{ padding: "0.5rem 0.6rem" }}>
                <select
                  value={rij.tier}
                  disabled={bezigId === rij.id}
                  onChange={(e) => void wijzig(rij.id, e.target.value)}
                  style={{
                    border: "1px solid var(--grait-border)",
                    borderRadius: "0.4rem",
                    padding: "0.3rem 0.5rem",
                    background: "var(--grait-card)",
                    color: "var(--grait-foreground)",
                  }}
                >
                  {tiers.map((t) => (
                    <option key={t.waarde} value={t.waarde}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
