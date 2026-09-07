/**
 * Brandstofverbruik-logica voor de kostenmodule. Puur, framework-onafhankelijk -
 * werkt op een array tankbeurten die de consumerende app aanlevert (geen
 * eigen databron, zie README "geen data-ophalen in deze package").
 */

export interface Tankbeurt {
  datum: string;
  kmStand: number;
  liters: number;
  volleTank: boolean;
  bedrag?: number;
}

export interface VerbruikMeting {
  /** De tankbeurt (volle tank) waarop deze meting slaat. */
  datum: string;
  kmStand: number;
  lPer100km: number;
}

/**
 * Berekent l/100km per volle tank: som van alle liters sinds de vorige volle
 * tank (inclusief tussentijdse halve tanks) gedeeld door de afgelegde km.
 * Levert geen meting op voor de allereerste volle tank (geen referentiepunt)
 * en slaat halve tanks over als losse meetpunten - ze tellen wel mee in de
 * opgetelde liters van de eerstvolgende volle tank.
 */
export function berekenVerbruikPerVolleTank(tankbeurten: Tankbeurt[]): VerbruikMeting[] {
  const gesorteerd = [...tankbeurten].sort((a, b) => a.kmStand - b.kmStand);

  const metingen: VerbruikMeting[] = [];
  let vorigeVolleTank: Tankbeurt | undefined;
  let litersSindsVorigeVolleTank = 0;

  for (const beurt of gesorteerd) {
    litersSindsVorigeVolleTank += beurt.liters;

    if (!beurt.volleTank) continue;

    if (vorigeVolleTank) {
      const afgelegdeKm = beurt.kmStand - vorigeVolleTank.kmStand;
      if (afgelegdeKm > 0) {
        metingen.push({
          datum: beurt.datum,
          kmStand: beurt.kmStand,
          lPer100km: (litersSindsVorigeVolleTank / afgelegdeKm) * 100,
        });
      }
    }

    vorigeVolleTank = beurt;
    litersSindsVorigeVolleTank = 0;
  }

  return metingen;
}

const VENSTER = 5;
const MINIMUM_METINGEN = 3;

/**
 * Voortschrijdend gemiddelde over de laatste `venster` metingen (standaard 5).
 * undefined zolang er minder dan MINIMUM_METINGEN (3) metingen zijn - te
 * weinig data om iets zinnigs te zeggen.
 */
export function voortschrijdendGemiddelde(metingen: VerbruikMeting[], venster = VENSTER): number | undefined {
  if (metingen.length < MINIMUM_METINGEN) return undefined;
  const laatste = metingen.slice(-venster);
  return laatste.reduce((s, m) => s + m.lPer100km, 0) / laatste.length;
}

const AFWIJKING_DREMPEL = 0.15;

/**
 * True als de nieuwste meting meer dan 15% boven het gemiddelde van de
 * mentingen dáárvóór ligt (dus zonder de nieuwste zelf mee te wegen).
 */
export function isAfwijkendeMeting(metingen: VerbruikMeting[], drempel = AFWIJKING_DREMPEL): boolean {
  if (metingen.length < MINIMUM_METINGEN + 1) return false;
  const [nieuwste, ...rest] = [...metingen].reverse();
  const gemiddeldeDaarvoor = voortschrijdendGemiddelde(rest.reverse());
  if (gemiddeldeDaarvoor === undefined) return false;
  return nieuwste.lPer100km > gemiddeldeDaarvoor * (1 + drempel);
}

export function kostenPerKm(totaalKosten: number, totaalAfgelegdeKm: number): number {
  if (totaalAfgelegdeKm <= 0) return 0;
  return totaalKosten / totaalAfgelegdeKm;
}
