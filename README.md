# @grait/ui

Gedeelde design tokens, Tailwind-preset en UI-componenten voor grAItt
Studio's apps: TravelCareGo, TravelCampGo en (later) Close2U. Doel: één bron
van waarheid voor kleuren/stijl, en herbruikbare bouwstenen zodat een module
die in de ene app gebouwd wordt (bv. een kostenmodule) zonder fork ook in de
andere twee past.

## Mappenstructuur

```
grait-ui/
├─ package.json           @grait/ui, tsup-build, publiceert naar npm.pkg.github.com
├─ tailwind-preset.js      Tailwind-preset: kleuren/radius/shadow/tap-maten
└─ src/
   ├─ index.ts             alles wat de package naar buiten exporteert
   ├─ tokens/
   │  ├─ tokens.css         CSS-variabelen — bron van waarheid voor kleuren
   │  └─ tokens.ts          zelfde waarden als JS-object (charts/PDF-export)
   ├─ components/           Button, Card, CategoryChip, AmountInput, ListRow, ConfirmDialog,
   │                        SortableGrid, Toaster
   ├─ modules/costs/        kostenmodule (config.ts/consumption.ts/schermen)
   ├─ modules/admin/        admin-dashboard-bouwstenen (StatKaart/WeekBarChart/GebruikersTabel)
   └─ modules/juridisch/    links naar privacy/voorwaarden/verwijderen op graittstudio.com
```

## Kleuren: waar ze vandaan komen

`tokens.css`/`tokens.ts` bevatten de **echte** hexwaarden uit TravelCampGo
(`src/styles.css`, gedefinieerd in oklch, hier omgezet naar hex) en de
categoriekleuren van de bestaande kostenmodule (`src/routes/kosten.index.tsx`,
`CATS`). Categorieën die alleen in TravelCareGo bestaan (Reparatie, Banden,
Verzekering, Wegenbelasting, Keuring, Stalling) hebben geen TravelCampGo-
equivalent — die kleuren zijn hier voor het eerst gekozen, afgestemd op de
rest van het palet. Zie de comments in `tokens.css` voor het onderscheid.

## Hoe aansluiten in een app

**1. CSS-variabelen laden** — importeer `tokens.css` vóór je eigen stylesheet,
bijvoorbeeld in de root van de app:

```ts
import "@grait/ui/tokens.css";
```

**2. Tailwind-preset gebruiken** — in de tailwind-config van de app:

```js
import graitPreset from "@grait/ui/tailwind-preset";

export default {
  presets: [graitPreset],
  content: ["./src/**/*.{ts,tsx}"],
};
```

Daarna zijn klassen als `bg-primary`, `text-secondary-foreground`,
`border-border`, `rounded` (via `--grait-radius`) en `min-h-tap`/`min-w-tap`
(44px-tikdoel) beschikbaar, gevuld vanuit de CSS-variabelen — dus licht/donker
(`.dark`) werkt automatisch mee.

**3. Componenten gebruiken**:

```tsx
import { Button, Card, CategoryChip, AmountInput, ListRow, ConfirmDialog, tokens, categorieKleuren } from "@grait/ui";
import { StatKaart, WeekBarChart, GebruikersTabel } from "@grait/ui";
```

## modules/admin — admin-dashboard-bouwstenen

Gedistilleerd uit TravelCareGo's admin-scherm (gebruikerslijst met tier-
wijzigen, #18, en het grafisch overzicht van gebruik, #19) nadat ook
TravelCampGo's eigen (uitgebreidere, rollen-gebaseerde) admin-systeem is
bekeken. Drie losse, herbruikbare bouwstenen, geen kant-en-klaar scherm:

- **`StatKaart`** — één cijfer + label + optionele subtekst.
- **`WeekBarChart`** — puur-CSS staafdiagram voor een tijdreeks (bv. nieuwe
  registraties per week), geen chart-library.
- **`GebruikersTabel`** — generieke tabel: e-mail, optionele extra kolommen
  (per app verschillend, dus als render-functie meegegeven), en een
  tier-select die `onWijzigTier` aanroept.

**Bewust niet gedistilleerd** (blijft per-app):
- De eigenlijke **toegangscontrole** (TravelCareGo: vaste e-maillijst
  server-side; TravelCampGo: een rollen-systeem met owner/admin) - deze
  bouwstenen doen zelf niets met authenticatie, de consumerende app bepaalt
  wie het scherm te zien krijgt.
- **Tabbladnavigatie** (TravelCampGo's `AdminTabs.tsx`) - te verweven met
  hun rollen-systeem en eigen router om nu al zinvol te generaliseren.
- **Data-ophalen/aggregatie** - blijft app-specifiek (Edge Function per app,
  zie TravelCareGo's `admin-gebruikers`/`admin-statistieken` als voorbeeld).

TravelCareGo zelf is **niet** omgebouwd om deze bouwstenen via de package
te gebruiken - dezelfde architectuurkeuze als bij de kostenmodule (zie
hieronder): eerst bewijzen dat het patroon standhoudt zodra een tweede app
het ook gebruikt, dan pas overstappen op de echte dependency.

## modules/juridisch — links naar privacy, voorwaarden en account verwijderen

Privacy, voorwaarden en accountverwijdering staan per app op graittstudio.com,
gemaakt uit één sjabloon in `graittstudio/graitt-site` (`maak-juridisch.py`).
Een app herhaalt die tekst niet, maar linkt ernaar (#14).

- **`juridischeAdressen(app)`** geeft de drie adressen voor een app, bv.
  `juridischeAdressen("travelspendgo").privacy`.
- **`JuridischeLinks`** is de kaart in de app: de korte versie als children,
  drie regels naar de volledige teksten, en het contactadres.

```tsx
import { JuridischeLinks } from "@grait/ui";
import { Browser } from "@capacitor/browser";

<JuridischeLinks
  app="travelspendgo"
  labels={{ privacy: t("privacy"), voorwaarden: t("voorwaarden"), verwijderen: t("verwijderen"), contact: t("contact") }}
  onOpen={(adres) => void Browser.open({ url: adres })}
>
  <p>{t("kortOverzicht")}</p>
</JuridischeLinks>
```

Labels zijn verplicht en hebben geen Nederlandse standaard (zie #3). De stijl
gebruikt de `--grait-*`-variabelen met terugvalwaarden, dus hij werkt ook in
een app zonder de Tailwind-preset.

Een nieuwe app krijgt eerst een blok in `maak-juridisch.py` en de pagina's
online; pas dan kloppen de links.

## Belangrijk: geen data-ophalen in deze package

Componenten en modules krijgen data via props. Supabase/Dexie/lokale opslag
hoort in de consumerende app, niet hier — dat houdt de package herbruikbaar
voor alle drie de apps ongeacht hun eigen databronnen.

## Status

- [x] Stap 1: repo-structuur
- [x] Stap 2: echte tokens uit TravelCampGo (zie boven voor de bron)
- [x] Stap 3: kostenmodule (`src/modules/costs/`) — `careGoConfig`/`campGoConfig`
      naast elkaar in config.ts, consumption.ts (l/100km per volle tank,
      voortschrijdend gemiddelde, 15%-afwijkingsmelding), CostOverview.tsx,
      CostEntryForm.tsx, export.ts. Build geverifieerd (`npm run build`).
- [x] Stap 4 (herzien): TravelCareGo kreeg de kostenmodule wél (#164), maar
      als geport/gekopieerde code in eigen stijl (`--ccg-*`-tokens, geen
      Tailwind-utility-klassen) i.p.v. een live afhankelijkheid van dit
      package - besluit van de architecture-/security-agent-check (nieuwe
      GPS-permissie + package nog zonder tests/versie). tokens.css/
      tailwind-preset worden dus (nog) nergens echt geïmporteerd.
- [x] `modules/admin`: gedistilleerd uit TravelCareGo's admin-scherm (#166,
      zie hierboven) - StatKaart, WeekBarChart, GebruikersTabel. Zelfde
      vendor-eerst-keuze: nog geen app die dit als live dependency gebruikt.

## Installeren in een app

```bash
npm i github:graittstudio/graitt-ui
```

Het `prepare`-script bouwt de bundel tijdens de installatie, zodat er niets
gepubliceerd hoeft te worden. `recharts`, `lucide-react` en react zijn peer
dependencies en installeert de app zelf. `xlsx` en `jspdf` zijn optioneel en
alleen nodig als de app de exportmodule gebruikt.

Deze repo is openbaar, dus dit werkt ook in CI zonder token.
