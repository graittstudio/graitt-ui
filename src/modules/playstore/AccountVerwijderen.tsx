import { useState, type ReactNode } from "react";
import { ACHTERGROND, KAART, KLEIN, KNOP_GEVAAR, KNOP_RUSTIG, RIJ, VENSTER } from "./stijl";

export interface AccountVerwijderenLabels {
  titel: string;
  /** Wat er weggaat, bv. "Je account, je reizen en je foto's." */
  uitleg: string;
  knop: string;
  bevestigTitel: string;
  /** Duidelijk zeggen dat het niet terug te draaien is. */
  bevestigTekst: string;
  bevestigKnop: string;
  annuleren: string;
  bezig: string;
  fout: string;
  /** Tekst voor het webadres, bv. "Ook zonder de app te verwijderen via". */
  viaWeb: string;
}

export interface AccountVerwijderenProps {
  labels: AccountVerwijderenLabels;
  /**
   * Wist het account echt: alle tabellen, opslag en het inlogaccount
   * (meestal een Supabase-functie). Gooit een fout als het mislukt.
   */
  onVerwijder: () => Promise<void>;
  /** Na gelukt verwijderen: uitloggen en naar het beginscherm. */
  onVerwijderd?: () => void;
  /** Het webadres, bv. `juridischeAdressen("travelspendgo").verwijderen`. */
  webAdres?: string;
  /** Een link openen buiten de app, bv. `Browser.open` in Capacitor. */
  onOpen?: (adres: string) => void;
  children?: ReactNode;
}

/**
 * Account verwijderen vanuit de app (Play Store-eis, docs/PLAY-STORE.md
 * punt 5 en 6). Altijd met een bevestigingsstap, en met het webadres erbij
 * zodat het ook zonder app kan.
 */
export function AccountVerwijderen({ labels, onVerwijder, onVerwijderd, webAdres, onOpen, children }: AccountVerwijderenProps) {
  const [vraag, setVraag] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(false);

  async function verwijder() {
    setBezig(true);
    setFout(false);
    try {
      await onVerwijder();
      setVraag(false);
      onVerwijderd?.();
    } catch {
      setFout(true);
    } finally {
      setBezig(false);
    }
  }

  return (
    <section style={KAART}>
      <h3 style={{ margin: 0, fontSize: "1rem" }}>{labels.titel}</h3>
      <p style={KLEIN}>{labels.uitleg}</p>
      {children}
      <div style={RIJ}>
        <button type="button" style={KNOP_GEVAAR} onClick={() => setVraag(true)}>
          {labels.knop}
        </button>
      </div>
      {webAdres && (
        <p style={KLEIN}>
          {labels.viaWeb}{" "}
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(webAdres)}
              style={{ background: "none", border: "none", padding: 0, color: "inherit", font: "inherit", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
            >
              {webAdres}
            </button>
          ) : (
            <a href={webAdres} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", fontWeight: 600 }}>
              {webAdres}
            </a>
          )}
        </p>
      )}

      {vraag && (
        <div style={ACHTERGROND} role="dialog" aria-modal="true" aria-labelledby="grait-verwijder-titel">
          <div style={VENSTER}>
            <h2 id="grait-verwijder-titel" style={{ margin: 0, fontSize: "1.15rem" }}>
              {labels.bevestigTitel}
            </h2>
            <p style={{ margin: "0.5rem 0 0" }}>{labels.bevestigTekst}</p>
            {fout && (
              <p role="alert" style={{ ...KLEIN, color: "var(--grait-destructive, #df202e)", fontWeight: 600 }}>
                {labels.fout}
              </p>
            )}
            <div style={RIJ}>
              <button type="button" style={KNOP_RUSTIG} disabled={bezig} onClick={() => setVraag(false)}>
                {labels.annuleren}
              </button>
              <button type="button" style={KNOP_GEVAAR} disabled={bezig} onClick={() => void verwijder()}>
                {bezig ? labels.bezig : labels.bevestigKnop}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
