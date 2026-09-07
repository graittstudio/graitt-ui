import { categorieKleuren, type CategorieKleur } from "../../tokens/tokens";

export interface CostCategory {
  id: string;
  label: string;
  color: string;
  /** Toont de brandstof-specifieke extra velden (km-stand, liters, volle tank) bij invoer. */
  fuel?: boolean;
  /** Terugkerende kost (bv. verzekering/wegenbelasting) - geen bon verwacht, wel een periode-hint in de UI. */
  recurring?: boolean;
}

export type CostScope = "vehicle" | "trip";

export interface CostModuleConfig {
  scope: CostScope;
  categories: CostCategory[];
}

function cat(id: string, label: string, color: CategorieKleur, extra?: Partial<CostCategory>): CostCategory {
  return { id, label, color: categorieKleuren[color], ...extra };
}

/**
 * TravelCareGo - onderhoudsapp, kosten horen bij één voertuig over de tijd
 * (geen losse "reis"), vandaar scope 'vehicle' met een periodekiezer i.p.v.
 * een simpel reistotaal.
 */
export const careGoConfig: CostModuleConfig = {
  scope: "vehicle",
  categories: [
    cat("brandstof", "Brandstof", "brandstof", { fuel: true }),
    cat("onderhoud", "Onderhoud", "onderhoud"),
    cat("reparatie", "Reparatie", "reparatie"),
    cat("banden", "Banden", "banden"),
    cat("verzekering", "Verzekering", "verzekering", { recurring: true }),
    cat("wegenbelasting", "Wegenbelasting", "wegenbelasting", { recurring: true }),
    cat("keuring", "Keuring", "keuring"),
    cat("overig", "Overig", "overig"),
  ],
};

/**
 * TravelCampGo - bestaande categorieën 1:1 overgenomen uit
 * src/routes/kosten.index.tsx (CATS). scope 'trip': het totaal hoort bij de
 * actieve reis, geen periodekiezer nodig.
 */
export const campGoConfig: CostModuleConfig = {
  scope: "trip",
  categories: [
    cat("brandstof", "Brandstof", "brandstof", { fuel: true }),
    cat("camping", "Camping", "camping"),
    cat("tol", "Tol", "tol"),
    cat("boodschappen", "Boodschappen", "boodschappen"),
    cat("restaurant", "Restaurant", "restaurant"),
    cat("onderhoud", "Onderhoud", "onderhoud"),
    cat("overig", "Overig", "overig"),
  ],
};

export function vindCategorie(config: CostModuleConfig, id: string): CostCategory | undefined {
  return config.categories.find((c) => c.id === id);
}
