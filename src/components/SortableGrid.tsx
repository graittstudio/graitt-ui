import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Een raster van tegels dat je op volgorde sleept: vasthouden, dan schuiven.
 * Komt uit TravelSpendGo (categorieën op volgorde, travelspendgo#56).
 *
 * Waarom vasthouden en niet meteen slepen: een tegel is ook iets om op te
 * tikken, en een vinger die over het scherm veegt wil scrollen. Pas na een
 * korte tijd stil houden wordt het slepen. Beweegt de vinger eerder, dan
 * gebeurt er niets en scrollt de pagina gewoon.
 *
 * Tijdens het slepen schuiven de andere tegels live op, zodat je ziet waar hij
 * terechtkomt. Pas bij loslaten gaat de nieuwe volgorde naar buiten, één
 * keer, en niet bij elke tegel die de vinger passeert.
 */

const VASTHOUDEN_MS = 350;
const TOLERANTIE_PX = 8;

export interface SortableGridProps<T> {
  items: T[];
  sleutel: (item: T) => string;
  /** Tekent één tegel. `sleept` is waar voor de tegel die nu vastzit. */
  tegel: (item: T, staat: { sleept: boolean }) => ReactNode;
  /** De nieuwe volgorde, als sleutels, na het loslaten. */
  onVolgorde: (sleutels: string[]) => void;
  /** Uit: gewoon een raster, zonder slepen. */
  aan?: boolean;
  kolommen?: number;
  className?: string;
}

export function SortableGrid<T>({
  items,
  sleutel,
  tegel,
  onVolgorde,
  aan = true,
  kolommen = 3,
  className = "",
}: SortableGridProps<T>) {
  const [volgorde, setVolgorde] = useState<string[]>(() => items.map(sleutel));
  const [sleept, setSleept] = useState<string | null>(null);
  const raster = useRef<HTMLUListElement>(null);
  const druk = useRef<{ sleutel: string; x: number; y: number; klok: number } | null>(null);
  const netGesleept = useRef(false);

  // Nieuwe items van buiten (toegevoegd, verwijderd) volgen, maar niet midden
  // in het slepen: dan zou de tegel onder de vinger wegspringen.
  useEffect(() => {
    if (sleept === null) setVolgorde(items.map(sleutel));
  }, [items, sleutel, sleept]);

  const perSleutel = new Map(items.map((item) => [sleutel(item), item]));

  function stopDruk() {
    if (druk.current) window.clearTimeout(druk.current.klok);
    druk.current = null;
  }

  function plekOnder(x: number, y: number): number | null {
    const tegels = raster.current?.querySelectorAll<HTMLElement>("[data-sorteer-sleutel]");
    if (!tegels) return null;
    for (const [plek, element] of Array.from(tegels).entries()) {
      const vak = element.getBoundingClientRect();
      if (x >= vak.left && x <= vak.right && y >= vak.top && y <= vak.bottom) return plek;
    }
    return null;
  }

  return (
    <ul
      ref={raster}
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${kolommen}, minmax(0, 1fr))` }}
    >
      {volgorde.map((sleutelWaarde) => {
        const item = perSleutel.get(sleutelWaarde);
        if (!item) return null;
        const ditSleept = sleept === sleutelWaarde;
        return (
          <li
            key={sleutelWaarde}
            data-sorteer-sleutel={sleutelWaarde}
            className={`relative transition-transform ${ditSleept ? "z-10 scale-105 drop-shadow-xl" : ""}`}
            // Alleen tijdens het sorteren: anders pakt de browser het vegen
            // over voor scrollen en komt het vasthouden nooit aan.
            style={aan ? { touchAction: "none" } : undefined}
            onPointerDown={(gebeurtenis) => {
              if (!aan) return;
              // Bleef er van een vorige keer slepen een geblokkeerde tik staan
              // (losgelaten naast een tegel, dus zonder klik), dan vervalt die nu.
              netGesleept.current = false;
              const doel = gebeurtenis.currentTarget;
              const pointerId = gebeurtenis.pointerId;
              druk.current = {
                sleutel: sleutelWaarde,
                x: gebeurtenis.clientX,
                y: gebeurtenis.clientY,
                klok: window.setTimeout(() => {
                  setSleept(sleutelWaarde);
                  netGesleept.current = true;
                  try {
                    doel.setPointerCapture(pointerId);
                  } catch {
                    // De vinger is al los; dan valt er niets vast te houden.
                  }
                  navigator.vibrate?.(15);
                }, VASTHOUDEN_MS),
              };
            }}
            onPointerMove={(gebeurtenis) => {
              if (sleept === null) {
                const begin = druk.current;
                if (
                  begin &&
                  Math.hypot(gebeurtenis.clientX - begin.x, gebeurtenis.clientY - begin.y) > TOLERANTIE_PX
                ) {
                  stopDruk();
                }
                return;
              }
              const doel = plekOnder(gebeurtenis.clientX, gebeurtenis.clientY);
              if (doel === null) return;
              setVolgorde((huidig) => {
                const van = huidig.indexOf(sleept);
                if (van === doel || van < 0) return huidig;
                const nieuw = [...huidig];
                nieuw.splice(van, 1);
                nieuw.splice(doel, 0, sleept);
                return nieuw;
              });
            }}
            onPointerUp={() => {
              stopDruk();
              if (sleept !== null) {
                setSleept(null);
                onVolgorde(volgorde);
              }
            }}
            onPointerCancel={() => {
              stopDruk();
              if (sleept !== null) {
                setSleept(null);
                setVolgorde(items.map(sleutel));
              }
            }}
            // Een tik na het slepen is geen tik op de tegel.
            onClickCapture={(gebeurtenis) => {
              if (netGesleept.current) {
                gebeurtenis.stopPropagation();
                gebeurtenis.preventDefault();
                netGesleept.current = false;
              }
            }}
          >
            {tegel(item, { sleept: ditSleept })}
          </li>
        );
      })}
    </ul>
  );
}
