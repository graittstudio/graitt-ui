/**
 * De Play Store-eisen uit docs/PLAY-STORE.md als data, voor een controlescript
 * of een beheerscherm. Stand 01-11-2026; bij elke jaarlijkse doel-API-ronde
 * (31 augustus) bijwerken.
 */

export const PLAY_DOEL_API = 36;

export type PlayEisSoort = "app" | "console";

export interface PlayEis {
  id: string;
  soort: PlayEisSoort;
  eis: string;
  /** Alleen als de app dit heeft, bv. `accounts` of `locatie`. */
  alleenBij?: "accounts" | "locatie" | "gebruikersinhoud" | "aankopen" | "media";
  /** Naam van de bouwsteen in @grait/ui, als die er is. */
  bouwsteen?: string;
}

export const PLAY_STORE_EISEN: PlayEis[] = [
  { id: "doel-api", soort: "app", eis: `targetSdkVersion ${PLAY_DOEL_API} (Android 16)` },
  { id: "16kb", soort: "app", eis: "16 KB-paginagrootte voor native libs" },
  { id: "rand-tot-rand", soort: "app", eis: "Veilige zones (safe-area) op kop, onderbalk en dialogen" },
  { id: "privacy", soort: "app", eis: "Privacyverklaring in de app en in de winkel", bouwsteen: "JuridischeLinks" },
  { id: "verwijderen-app", soort: "app", eis: "Account verwijderen in de app", alleenBij: "accounts", bouwsteen: "AccountVerwijderen" },
  { id: "verwijderen-web", soort: "app", eis: "Account verwijderen via een webadres", alleenBij: "accounts", bouwsteen: "juridischeAdressen" },
  { id: "toestemming-uitleg", soort: "app", eis: "Uitleg vóór gevoelige toestemmingen", bouwsteen: "ToestemmingUitleg" },
  { id: "locatie-voorgrond", soort: "app", eis: "Locatie alleen op de voorgrond, tenzij kernfunctie met verklaring", alleenBij: "locatie" },
  { id: "geen-heimelijk-volgen", soort: "app", eis: "Locatie delen zichtbaar en met één tik te stoppen", alleenBij: "locatie" },
  { id: "melden-blokkeren", soort: "app", eis: "Melden en blokkeren + voorwaarden tegen misbruik", alleenBij: "gebruikersinhoud", bouwsteen: "MeldenOfBlokkeren" },
  { id: "fotokiezer", soort: "app", eis: "Fotokiezer van het systeem i.p.v. READ_MEDIA_*", alleenBij: "media" },
  { id: "play-billing", soort: "app", eis: "Digitale aankopen via Google Play Billing (Library 8+)", alleenBij: "aankopen" },
  { id: "geen-eigen-updater", soort: "app", eis: "Geen eigen APK-update of REQUEST_INSTALL_PACKAGES in de Play-build" },
  { id: "meer-dan-website", soort: "app", eis: "Meer doen dan een website tonen" },
  { id: "verificatie", soort: "console", eis: "Ontwikkelaarsverificatie (identiteit / D-U-N-S)" },
  { id: "gesloten-test", soort: "console", eis: "Persoonlijk account: 12 testers, 14 dagen gesloten test" },
  { id: "aab", soort: "console", eis: "App-bundel (.aab) met Play App Signing" },
  { id: "winkelvermelding", soort: "console", eis: "Pictogram 512×512, functieafbeelding 1024×500, ≥2 schermafbeeldingen, teksten" },
  { id: "data-safety", soort: "console", eis: "Formulier gegevensveiligheid" },
  { id: "classificatie", soort: "console", eis: "Inhoudsclassificatie (IARC)" },
  { id: "doelgroep", soort: "console", eis: "Doelgroep en advertenties opgeven" },
  { id: "app-toegang", soort: "console", eis: "Testaccount voor de keurder, zonder CAPTCHA-blokkade" },
];
