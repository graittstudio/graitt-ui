import { useEffect, useState } from "react";
import { zoekUitgave, type Uitgave, type ZoekUitgaveOpties } from "./versie";

/** Elke tien minuten opnieuw, voor wie de app dagen open laat staan. */
const HERHAAL_MS = 10 * 60_000;

/**
 * Eén antwoord op "is er een nieuwe versie" voor het bolletje op de
 * hamburger, het bolletje bij Updates en de melding zelf. Roep hem één keer
 * aan (bovenin de app) en geef het resultaat door: drie plekken die los
 * ophalen kunnen elkaar tegenspreken.
 *
 * Kijkt ook opnieuw als de app terug in beeld komt.
 */
export function useUpdate(opties: ZoekUitgaveOpties): Uitgave | null {
  const [uitgave, zetUitgave] = useState<Uitgave | null>(null);
  const { adres, huidigeVersie, opToestel, uitgezet } = opties;

  useEffect(() => {
    let levend = true;
    const kijk = () => {
      void zoekUitgave({ adres, huidigeVersie, opToestel, uitgezet }).then((gevonden) => {
        if (levend) zetUitgave(gevonden);
      });
    };
    const zichtbaar = () => {
      if (document.visibilityState === "visible") kijk();
    };
    kijk();
    const klok = window.setInterval(kijk, HERHAAL_MS);
    document.addEventListener("visibilitychange", zichtbaar);
    return () => {
      levend = false;
      window.clearInterval(klok);
      document.removeEventListener("visibilitychange", zichtbaar);
    };
  }, [adres, huidigeVersie, opToestel, uitgezet]);

  return uitgave;
}
