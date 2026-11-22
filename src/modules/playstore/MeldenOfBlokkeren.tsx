import { useState } from "react";
import { ACHTERGROND, KLEIN, KNOP_GEVAAR, KNOP_HOOFD, KNOP_RUSTIG, RIJ, VENSTER } from "./stijl";

export interface MeldReden {
  /** Wat de app opslaat, bv. `spam`, `intimidatie`, `ongepast`. */
  sleutel: string;
  label: string;
}

export interface MeldenOfBlokkerenLabels {
  titel: string;
  toelichting: string;
  melden: string;
  blokkeren: string;
  annuleren: string;
  /** Knop om het venster na het melden te sluiten. */
  ok: string;
  /** Na het melden, bv. "Bedankt, we kijken ernaar." */
  bedankt: string;
}

export interface MeldenOfBlokkerenProps {
  open: boolean;
  labels: MeldenOfBlokkerenLabels;
  redenen: MeldReden[];
  /** Slaat de melding op (bv. in een tabel `meldingen`). */
  onMelden: (reden: string, toelichting: string) => Promise<void>;
  /** Weglaten als blokkeren hier niet kan (bv. bij een foto i.p.v. een persoon). */
  onBlokkeren?: () => Promise<void>;
  onSluit: () => void;
}

/**
 * Melden en blokkeren bij alles wat andere gebruikers kunnen zien (Play
 * Store-eis voor inhoud van gebruikers, docs/PLAY-STORE.md punt 9). Iemand
 * moet de meldingen ook echt lezen; het beheerscherm van de app toont ze.
 */
export function MeldenOfBlokkeren({ open, labels, redenen, onMelden, onBlokkeren, onSluit }: MeldenOfBlokkerenProps) {
  const [reden, setReden] = useState("");
  const [toelichting, setToelichting] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);

  if (!open) return null;

  function sluit() {
    setReden("");
    setToelichting("");
    setKlaar(false);
    onSluit();
  }

  async function doe(actie: () => Promise<void>) {
    setBezig(true);
    try {
      await actie();
      setKlaar(true);
    } finally {
      setBezig(false);
    }
  }

  return (
    <div style={ACHTERGROND} role="dialog" aria-modal="true" aria-labelledby="grait-melden-titel">
      <div style={VENSTER}>
        <h2 id="grait-melden-titel" style={{ margin: 0, fontSize: "1.15rem" }}>
          {labels.titel}
        </h2>
        {klaar ? (
          <>
            <p style={{ margin: "0.5rem 0 0" }}>{labels.bedankt}</p>
            <div style={RIJ}>
              <button type="button" style={KNOP_HOOFD} onClick={sluit}>
                {labels.ok}
              </button>
            </div>
          </>
        ) : (
          <>
            <div role="radiogroup" style={{ marginTop: "0.5rem" }}>
              {redenen.map((r) => (
                <label key={r.sleutel} style={{ display: "flex", alignItems: "center", gap: "0.5rem", minHeight: "44px", cursor: "pointer" }}>
                  <input type="radio" name="grait-meldreden" checked={reden === r.sleutel} onChange={() => setReden(r.sleutel)} />
                  {r.label}
                </label>
              ))}
            </div>
            <label style={KLEIN}>
              {labels.toelichting}
              <textarea
                value={toelichting}
                onChange={(e) => setToelichting(e.target.value)}
                rows={3}
                style={{ display: "block", width: "100%", marginTop: "0.25rem", font: "inherit", boxSizing: "border-box" }}
              />
            </label>
            <div style={RIJ}>
              <button type="button" style={KNOP_RUSTIG} disabled={bezig} onClick={sluit}>
                {labels.annuleren}
              </button>
              <button type="button" style={KNOP_HOOFD} disabled={bezig || !reden} onClick={() => void doe(() => onMelden(reden, toelichting.trim()))}>
                {labels.melden}
              </button>
            </div>
            {onBlokkeren && (
              <div style={RIJ}>
                <button type="button" style={KNOP_GEVAAR} disabled={bezig} onClick={() => void doe(onBlokkeren)}>
                  {labels.blokkeren}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
