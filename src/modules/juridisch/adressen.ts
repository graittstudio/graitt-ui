/**
 * Waar de juridische pagina's van een app staan (#14).
 *
 * Privacy, voorwaarden en accountverwijdering staan per app op graittstudio.com,
 * gemaakt uit één sjabloon in graittstudio/graitt-site (`maak-juridisch.py`).
 * Een app hoort die adressen niet met de hand over te typen: een typfout in
 * een link naar het privacybeleid merk je pas als de Play Store hem afkeurt.
 */

export const STUDIO_SITE = "https://graittstudio.com";
export const STUDIO_CONTACT = "hallo@graittstudio.com";

export interface JuridischeAdressen {
  privacy: string;
  voorwaarden: string;
  verwijderen: string;
}

/**
 * @param app de map van de app op de site, zoals `travelspendgo` of `travelcarego`.
 * @param site alleen voor tests of een andere omgeving; standaard graittstudio.com.
 */
export function juridischeAdressen(app: string, site: string = STUDIO_SITE): JuridischeAdressen {
  const map = app.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  if (!/^[a-z0-9-]+$/.test(map)) {
    throw new Error(`Ongeldige app-map voor juridische pagina's: "${app}"`);
  }
  const basis = `${site.replace(/\/+$/, "")}/${map}`;
  return {
    privacy: `${basis}/privacy.html`,
    voorwaarden: `${basis}/voorwaarden.html`,
    verwijderen: `${basis}/verwijderen.html`,
  };
}
