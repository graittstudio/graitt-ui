import type { ReactNode } from "react";
import { ACHTERGROND, KLEIN, KNOP_HOOFD, KNOP_RUSTIG, RIJ, VENSTER } from "./stijl";

export interface ToestemmingUitlegLabels {
  /** Kop, bv. "Je locatie gebruiken". */
  titel: string;
  /** Wat de app ermee doet, in gewone taal. */
  waarom: string;
  /**
   * Wanneer het gebeurt, bv. "Alleen zolang dit scherm open is." Google wil
   * dat zien; bij achtergrondlocatie moet hier letterlijk staan dat het ook
   * gebeurt als de app gesloten is.
   */
  wanneer: string;
  doorgaan: string;
  nietNu: string;
}

export interface ToestemmingUitlegProps {
  open: boolean;
  labels: ToestemmingUitlegLabels;
  /** Een pictogram of kleine afbeelding boven de kop. */
  pictogram?: ReactNode;
  /** Extra uitleg, bv. met wie het gedeeld wordt. */
  children?: ReactNode;
  /** Pas hier de systeemvraag stellen (Geolocation.requestPermissions e.d.). */
  onDoorgaan: () => void;
  /** De app moet zonder deze toestemming gewoon verder werken. */
  onNietNu: () => void;
}

/**
 * Uitleg vóór een gevoelige toestemming (Play Store-eis "prominent
 * disclosure", zie docs/PLAY-STORE.md punt 7 en 8): eerst dit scherm, dan pas
 * de vraag van het systeem. Niet overslaan als de toestemming al eens
 * geweigerd is; dan stuurt de app naar de instellingen.
 */
export function ToestemmingUitleg({ open, labels, pictogram, children, onDoorgaan, onNietNu }: ToestemmingUitlegProps) {
  if (!open) return null;
  return (
    <div style={ACHTERGROND} role="dialog" aria-modal="true" aria-labelledby="grait-toestemming-titel">
      <div style={VENSTER}>
        {pictogram && <div style={{ marginBottom: "0.5rem" }}>{pictogram}</div>}
        <h2 id="grait-toestemming-titel" style={{ margin: 0, fontSize: "1.15rem" }}>
          {labels.titel}
        </h2>
        <p style={{ margin: "0.5rem 0 0" }}>{labels.waarom}</p>
        <p style={{ ...KLEIN, fontWeight: 600 }}>{labels.wanneer}</p>
        {children && <div style={KLEIN}>{children}</div>}
        <div style={RIJ}>
          <button type="button" style={KNOP_RUSTIG} onClick={onNietNu}>
            {labels.nietNu}
          </button>
          <button type="button" style={KNOP_HOOFD} onClick={onDoorgaan}>
            {labels.doorgaan}
          </button>
        </div>
      </div>
    </div>
  );
}
