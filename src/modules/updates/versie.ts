/**
 * Is er een nieuwere versie van de app? Hetzelfde patroon als TravelCareGo,
 * TripSpendGo/HomeSpendGo en Close2U, nu op één plek.
 *
 * Naast de APK staat een klein versiebestand, bv. `versie-instantcleango.json`:
 *
 *   {"versie":"0.3.2","url":"https://…/instantcleango-0.3.2-<hex>.apk",
 *    "wat":"Eén regel","wat_per_taal":{"en":"…"}}
 *
 * Wie de APK vervangt, zet dit bestand als laatste neer: het is het signaal
 * waar de apps op letten.
 */

export interface Uitgave {
  versie: string;
  /** Waar de nieuwe versie vandaan komt. Leeg op het web: daar is het vernieuwen. */
  url?: string;
  /** Eén regel over wat er nieuw is, in het Nederlands. Mag ontbreken. */
  wat?: string;
  /** Dezelfde regel per taal. Apart veld, zodat oude apps die `wat` tonen niet vastlopen. */
  wat_per_taal?: Partial<Record<string, string>>;
  /** Op een toestel haal je een APK op, in een browser herlaad je de pagina. */
  soort: "apk" | "web";
}

export interface ZoekUitgaveOpties {
  /** Volledig adres van het versiebestand. Leeg = niet kijken. */
  adres: string;
  /** Het eigen versienummer, uit package.json (`__APP_VERSION__`). */
  huidigeVersie: string;
  /** Draait de app als APK op een toestel (Capacitor.isNativePlatform()). */
  opToestel: boolean;
  /**
   * Play Store-versie: nooit zelf naar updates kijken (Play-eis
   * "geen-eigen-updater", zie docs/PLAY-STORE.md).
   */
  uitgezet?: boolean;
}

/**
 * Vergelijkt twee versienummers als 0.10.2. Niet als tekst: dan is "0.9.0"
 * nieuwer dan "0.47.0".
 */
export function isNieuwer(nieuw: string, oud: string): boolean {
  const a = nieuw.split(".").map((deel) => parseInt(deel, 10) || 0);
  const b = oud.split(".").map((deel) => parseInt(deel, 10) || 0);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const verschil = (a[i] ?? 0) - (b[i] ?? 0);
    if (verschil !== 0) return verschil > 0;
  }
  return false;
}

/**
 * Kijkt of er een nieuwere versie klaarstaat. Mislukt er iets (geen
 * verbinding, bestand bestaat niet, onzin erin), dan komt er `null` terug:
 * een updatemelding is een extraatje en mag nooit in de weg zitten.
 */
export async function zoekUitgave({ adres, huidigeVersie, opToestel, uitgezet }: ZoekUitgaveOpties): Promise<Uitgave | null> {
  if (uitgezet || !adres) return null;
  try {
    const antwoord = await fetch(adres, { cache: "no-store" });
    if (!antwoord.ok) return null;
    const uit = (await antwoord.json()) as Partial<Uitgave>;
    if (!uit?.versie || typeof uit.versie !== "string") return null;
    // Zonder link valt er op een toestel niets op te halen: dan geen bolletje.
    if (opToestel && !uit.url) return null;
    if (!isNieuwer(uit.versie, huidigeVersie)) return null;
    return { versie: uit.versie, url: uit.url, wat: uit.wat, wat_per_taal: uit.wat_per_taal, soort: opToestel ? "apk" : "web" };
  } catch {
    return null;
  }
}

/** Wat er nieuw is in de taal van de app, anders het Nederlands, anders niets. */
export function watIsNieuw(uitgave: Pick<Uitgave, "wat" | "wat_per_taal">, taal: string): string | undefined {
  const inTaal = uitgave.wat_per_taal?.[taal];
  if (typeof inTaal === "string" && inTaal.trim()) return inTaal;
  return typeof uitgave.wat === "string" && uitgave.wat.trim() ? uitgave.wat : undefined;
}

/**
 * Haalt de nieuwe versie op. Weg-navigeren en niet window.open: Capacitor
 * opent een adres buiten de app in de browser van de telefoon, die de APK
 * downloadt en installeren aanbiedt. Op het web: vernieuwen.
 */
export function haalUitgaveOp(uitgave: Uitgave): void {
  if (uitgave.soort === "web") window.location.reload();
  else if (uitgave.url) window.location.href = uitgave.url;
}
