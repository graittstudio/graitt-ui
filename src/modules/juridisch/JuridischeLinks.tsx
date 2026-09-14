import type { ReactNode } from "react";
import { STUDIO_CONTACT, juridischeAdressen, type JuridischeAdressen } from "./adressen";

export interface JuridischeLinksLabels {
  privacy: string;
  voorwaarden: string;
  verwijderen: string;
  /** Tekst voor het contactadres, bv. "Vragen over je gegevens". */
  contact: string;
}

export interface JuridischeLinksProps {
  /** De map van de app op graittstudio.com, bv. `travelspendgo`. */
  app: string;
  /**
   * Alle zichtbare teksten, in de taal van de app. Bewust verplicht en zonder
   * Nederlandse standaard: anders staat er in een Duitse app "Privacy" naast
   * "Konto löschen" (zie #3).
   */
  labels: JuridischeLinksLabels;
  /** De korte versie in de app, boven de links. */
  children?: ReactNode;
  /** Een ander contactadres dan dat van de studio. */
  contact?: string;
  /**
   * Een link openen. In een Capacitor-app hoort een adres buiten de app in de
   * browser van de telefoon te openen; geef daarvoor bv. `Browser.open` mee.
   * Zonder deze functie is het een gewone link in een nieuw tabblad.
   */
  onOpen?: (adres: string) => void;
  /** Andere adressen dan graittstudio.com, bv. voor een test. */
  adressen?: JuridischeAdressen;
}

const KAART = {
  background: "var(--grait-card, #ffffff)",
  color: "var(--grait-card-foreground, #111b28)",
  border: "1px solid var(--grait-border, #dcd7cd)",
  borderRadius: "var(--grait-radius, 1.1rem)",
  padding: "1rem",
} as const;

const REGEL = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.75rem",
  minHeight: "44px",
  padding: "0.5rem 0",
  borderTop: "1px solid var(--grait-border, #dcd7cd)",
  color: "inherit",
  font: "inherit",
  fontWeight: 600,
  textDecoration: "none",
  background: "none",
  width: "100%",
  textAlign: "left",
  cursor: "pointer",
} as const;

/**
 * De juridische kaart van een app (#14): de korte versie in de app, en links
 * naar de volledige teksten op graittstudio.com. Zo staat de tekst op één plek
 * en zegt de app nooit iets anders dan de website.
 *
 * Stijl via de `--grait-*`-variabelen met terugvalwaarden, zodat hij ook werkt
 * in een app zonder de Tailwind-preset.
 */
export function JuridischeLinks({ app, labels, children, contact = STUDIO_CONTACT, onOpen, adressen }: JuridischeLinksProps) {
  const links = adressen ?? juridischeAdressen(app);
  const regels: { sleutel: keyof JuridischeAdressen; label: string }[] = [
    { sleutel: "privacy", label: labels.privacy },
    { sleutel: "voorwaarden", label: labels.voorwaarden },
    { sleutel: "verwijderen", label: labels.verwijderen },
  ];

  return (
    <section style={KAART}>
      {children && <div style={{ marginBottom: "0.75rem" }}>{children}</div>}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {regels.map(({ sleutel, label }) => (
          <li key={sleutel}>
            {onOpen ? (
              <button type="button" style={REGEL} onClick={() => onOpen(links[sleutel])}>
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ) : (
              <a style={REGEL} href={links[sleutel]} target="_blank" rel="noopener noreferrer">
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", color: "var(--grait-muted-foreground, #565e69)" }}>
        {labels.contact}:{" "}
        <a href={`mailto:${contact}`} style={{ color: "inherit", fontWeight: 600 }}>
          {contact}
        </a>
      </p>
    </section>
  );
}
