# Play Store: wat een app nodig heeft

Stand 1 november 2026. Google past de regels elk jaar aan (doel-API rond
31 augustus), dus kijk bij een indiening altijd even naar de bronnen onderaan.

**Afspraak (Paul, 01-11-2026):** elke nieuwe grAItt-app krijgt de punten uit
deel A en de bouwstenen uit `@grait/ui` (deel B) meteen vanaf het begin mee.
Niet eerst vragen; alleen melden in de oplevering wat er is ingebouwd.
Of de app daadwerkelijk de winkel in gaat, beslist Paul apart.

---

## A. Wat er in de app gebouwd moet worden

| # | Eis | Hoe bij ons | Bouwsteen |
|---|-----|-------------|-----------|
| 1 | **Doel-API 36** (Android 16) voor nieuwe apps en updates sinds 31-08-2026 | `targetSdkVersion 36`, `compileSdkVersion 36` in `android/variables.gradle` (Capacitor) | – |
| 2 | **16 KB-paginagrootte** (verplicht sinds 01-11-2025 bij doel-API 35+) | Capacitor 7+ en recente native libs; controleren met *APK Analyzer* of de Play Console-waarschuwing | – |
| 3 | **Rand-tot-rand-scherm** (edge-to-edge, afgedwongen vanaf API 35) | `env(safe-area-inset-*)` op kop, onderbalk en dialogen; niets onder de navigatiebalk | `ConfirmDialog` (#12) |
| 4 | **Privacyverklaring**: link in de app én in de winkelvermelding | pagina op graittstudio.com via `maak-juridisch.py` | `JuridischeLinks` |
| 5 | **Account verwijderen** in de app, als de app accounts heeft | knop die echt alles wist (alle tabellen + opslag), geen "deactiveren" | `AccountVerwijderen` |
| 6 | **Account verwijderen via een webadres** zonder de app | `/<app>/verwijderen.html` | `juridischeAdressen(app).verwijderen` |
| 7 | **Duidelijke uitleg vóór gevoelige toestemmingen** (locatie, camera, microfoon, contacten, meldingen) | eerst ons eigen scherm, dan pas de systeemvraag | `ToestemmingUitleg` |
| 8 | **Achtergrondlocatie** alleen als kernfunctie, met aparte verklaring + video | standaard: alleen voorgrond (`watchPosition` zolang het scherm open is) | `ToestemmingUitleg` |
| 9 | **Inhoud van gebruikers** (berichten, foto's, profielen, namen): melden, blokkeren, voorwaarden die misbruik verbieden, en iemand die meldingen afhandelt | meld-tabel + blokkeerlijst in de eigen Supabase, beheerscherm leest meldingen | `MeldenOfBlokkeren` |
| 10 | **Geen heimelijk volgen** (stalkerware-regel) | locatie delen alleen door de persoon zelf, zichtbaar zolang het loopt, met één tik te stoppen | – |
| 11 | **Foto's/video's**: geen `READ_MEDIA_IMAGES/VIDEO` voor een eenmalige keuze | de fotokiezer van het systeem (Capacitor Camera `pickImages` / `<input type="file">`) | – |
| 12 | **Voorgronddiensten** (Android 14+): type opgeven en in de Console verantwoorden | alleen gebruiken als het echt moet | – |
| 13 | **Digitale aankopen** (Pro, Lite, extra's) via **Google Play Billing** (Billing Library 8+) | geen eigen betaallink in de Play-versie voor digitale functies; in de EER mag een alternatief systeem naast Play | – |
| 14 | **Meer dan een website** (minimumfunctionaliteit): een webversie in een app-jasje mag, als de app echt iets doet | offline werken, meldingen, camera, lokale opslag | – |
| 15 | **Geen eigen updatemechanisme** in de Play-versie: een app uit de Play Store mag zichzelf niet buiten Play om bijwerken of APK's installeren | de update-pop-up met APK-download (zoals bij Protect and Serve) uitzetten in de Play-build; `REQUEST_INSTALL_PACKAGES` eruit | – |
| 16 | **Inloggen voor de keurder**: werkend testaccount opgeven bij *App-toegang* | vast testaccount in de Supabase van de app; CAPTCHA mag de keurder niet blokkeren | – |

## B. Bouwstenen in `@grait/ui`

```tsx
import { JuridischeLinks, AccountVerwijderen, ToestemmingUitleg, MeldenOfBlokkeren } from "@grait/ui";
```

Alle teksten zijn verplichte `labels` zonder Nederlandse standaard (zie #3):
de app geeft ze in haar eigen taal mee. Opslag en Supabase-aanroepen blijven
in de app; de bouwstenen krijgen alleen functies mee.

- **`ToestemmingUitleg`**: scherm vóór de systeemvraag. Zegt wat, waarom en
  of het op de achtergrond gebeurt. Twee knoppen: doorgaan / niet nu.
- **`AccountVerwijderen`**: kaart met uitleg, verwijderknop, bevestigingsstap
  en een foutmelding als het misgaat. Toont ook het webadres uit punt 6.
- **`MeldenOfBlokkeren`**: venster met redenen, optionele toelichting,
  een meldknop en een blokkeerknop.
- **`JuridischeLinks`**: privacy, voorwaarden, verwijderen, contact.
- **`PLAY_STORE_EISEN`**: deze lijst als data, voor een controlescript of
  een beheerscherm.

## C. Wat in de Play Console geregeld moet worden (geen code)

1. **Ontwikkelaarsaccount**: eenmalig $25. Sinds 2026 is
   **ontwikkelaarsverificatie** verplicht (identiteit, en bij een organisatie
   een D-U-N-S-nummer). Vanaf 30-09-2026 geldt dat in Brazilië, Indonesië,
   Singapore en Thailand ook voor apps buiten de winkel (APK); wereldwijd in
   2027. Dat raakt dus ook onze losse APK's.
2. **Persoonlijk account (na 13-11-2023)**: eerst een **gesloten test met
   minimaal 12 testers die 14 dagen achter elkaar ingeschreven blijven**, pas
   dan productie aanvragen. Een organisatie-account (grAItt Studio) heeft die
   eis niet. Reken op ongeveer drie weken voor de eerste uitgave.
3. **App-bundel (.aab)** met *Play App Signing*; de uploadsleutel bewaren op de
   BitLocker-sticks naast de bestaande sleutels.
4. **Winkelvermelding**: naam (max 30 tekens), korte beschrijving (80),
   lange beschrijving (4000), pictogram 512×512 PNG, functieafbeelding
   1024×500, minstens 2 schermafbeeldingen per apparaattype, categorie,
   contact-e-mail, link naar de privacyverklaring.
5. **Gegevensveiligheid (Data safety)**: per soort gegeven opgeven wat je
   verzamelt, of je het deelt, of het versleuteld is en of het gewist kan
   worden. Supabase telt als verwerker, niet als "delen".
6. **Inhoudsclassificatie** (IARC-vragenlijst).
7. **Doelgroep en inhoud**: leeftijdsgroepen; geen kinderen tenzij bewust
   (dan gelden de *Families*-regels).
8. **Advertenties**: ja/nee.
9. **App-toegang**: testaccount voor de keurder (punt 16).
10. **Verklaringen** waar van toepassing: achtergrondlocatie, financiële
    functies, gezondheid, overheid, nieuws, voorgronddiensten,
    `QUERY_ALL_PACKAGES`, toegankelijkheidsdienst, exacte wekker.

## D. Let op per app

- **Protect and Serve (SpyCheckGo)**: bewust niet in de Play Store. Een scan
  van andere apps vraagt `QUERY_ALL_PACKAGES` en valt onder streng beleid.
- **18+-apps (FunTogetherGo)**: seksuele inhoud is in de Play Store niet
  toegestaan; eerst het beleid voor ongepaste inhoud nalopen.
- **Locatiedelen (Close2U, Onderweg in TCG)**: punten 7, 8 en 10 zijn de
  kern van de keuring.

## Bronnen

- Doel-API: https://developer.android.com/google/play/requirements/target-sdk
- Testers voor nieuwe persoonlijke accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- Ontwikkelaarsverificatie: https://developer.android.com/developer-verification
- Account verwijderen: https://support.google.com/googleplay/android-developer/answer/13327111
- Gegevensveiligheid: https://support.google.com/googleplay/android-developer/answer/10787469
- Inhoud van gebruikers: https://support.google.com/googleplay/android-developer/answer/9876937
- Fotokiezer en mediarechten: https://support.google.com/googleplay/android-developer/answer/14115180
