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
   ├─ components/           Button, Card, CategoryChip, AmountInput, ListRow, ConfirmDialog
   └─ modules/costs/        kostenmodule (config.ts/consumption.ts/schermen) — nog te bouwen
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
```

## Belangrijk: geen data-ophalen in deze package

Componenten en modules krijgen data via props. Supabase/Dexie/lokale opslag
hoort in de consumerende app, niet hier — dat houdt de package herbruikbaar
voor alle drie de apps ongeacht hun eigen databronnen.

## Status

- [x] Stap 1: repo-structuur
- [x] Stap 2: echte tokens uit TravelCampGo (zie boven voor de bron)
- [ ] Stap 3: kostenmodule (`src/modules/costs/`) — config.ts met
      `careGoConfig`/`campGoConfig`, consumption.ts, CostOverview.tsx,
      CostEntryForm.tsx, export.ts
- [ ] Stap 4: aansluiten in TravelCareGo (tokens.css + tailwind-preset +
      de nieuwe schermen)
