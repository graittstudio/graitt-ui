import { KAART, KLEIN, KNOP_HOOFD, KNOP_RUSTIG } from "../playstore/stijl";
import { Bolletje } from "./Hoofdmenu";
import { haalUitgaveOp, watIsNieuw, type Uitgave } from "./versie";

export interface UpdateKaartLabels {
  /** Kop, bv. "Updates". */
  titel: string;
  /** "Je hebt versie {versie}" — {versie} wordt ingevuld. */
  jijHebt: string;
  /** "Versie {versie} staat klaar" — {versie} wordt ingevuld. */
  nieuw: string;
  /** "Je hebt de nieuwste versie." */
  bijgewerkt: string;
  /** Knop op een toestel, bv. "Nieuwe versie downloaden". */
  ophalen: string;
  /** Knop op het web, bv. "Vernieuwen". */
  vernieuwen: string;
  /** Knop "Opnieuw kijken". */
  opnieuw: string;
  /** Uitleg onder de knop op een toestel, bv. hoe installeren gaat. */
  installeren?: string;
}

export interface UpdateKaartProps {
  uitgave: Uitgave | null;
  huidigeVersie: string;
  taal: string;
  labels: UpdateKaartLabels;
  /** Laat de app opnieuw kijken (bv. door de hook opnieuw te starten). */
  onOpnieuw?: () => void;
}

const vul = (tekst: string, versie: string) => tekst.replace("{versie}", versie);

/**
 * Wat er onder *Updates* in het menu staat: de eigen versie, en als er een
 * nieuwe is een rood bolletje, wat er nieuw is en een knop om hem op te halen.
 */
export function UpdateKaart({ uitgave, huidigeVersie, taal, labels, onOpnieuw }: UpdateKaartProps) {
  return (
    <div style={KAART}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.05rem" }}>
        {labels.titel}
        {uitgave && <Bolletje />}
      </div>
      <p style={KLEIN}>{vul(labels.jijHebt, huidigeVersie)}</p>
      {uitgave ? (
        <>
          <p style={{ margin: "0.75rem 0 0", fontWeight: 700 }}>{vul(labels.nieuw, uitgave.versie)}</p>
          {watIsNieuw(uitgave, taal) && <p style={KLEIN}>{watIsNieuw(uitgave, taal)}</p>}
          <div style={{ display: "flex", marginTop: "1rem" }}>
            <button type="button" style={KNOP_HOOFD} onClick={() => haalUitgaveOp(uitgave)}>
              {uitgave.soort === "web" ? labels.vernieuwen : labels.ophalen}
            </button>
          </div>
          {uitgave.soort === "apk" && labels.installeren && <p style={KLEIN}>{labels.installeren}</p>}
        </>
      ) : (
        <>
          <p style={{ margin: "0.75rem 0 0", fontWeight: 600 }}>{labels.bijgewerkt}</p>
          {onOpnieuw && (
            <div style={{ display: "flex", marginTop: "1rem" }}>
              <button type="button" style={KNOP_RUSTIG} onClick={onOpnieuw}>
                {labels.opnieuw}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
