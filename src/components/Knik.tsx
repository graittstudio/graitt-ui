import { useEffect, useState, type CSSProperties } from "react";

/**
 * "De Knik": het herkenningsteken van de grAItt-apps. Drie even lange streepjes waarvan alleen
 * het middelste iets naar rechts staat, in de kleuren van de Nederlandse vlag (rood, wit, blauw).
 * Open: het middelste streepje schuift terug in lijn en vervaagt, boven en onder worden een kruisje.
 * Dicht: het kruisje ontvouwt zich en het middelste streepje veert terug naar rechts.
 * ~220 ms per richting. Bij verminderde beweging springt hij direct naar de eindstand.
 *
 * Alleen inline stijl (geen stylesheet nodig). De stand komt van buiten (`open`), zodat het icoon
 * altijd klopt met het echte menu.
 */
export interface KnikProps {
  open: boolean;
  /** Breedte en hoogte in px (standaard 24). */
  grootte?: number;
  /** "vlag" = rood/wit/blauw (standaard); "neutraal" = kleur van de omgeving (currentColor). */
  kleuren?: "vlag" | "neutraal";
}

const ROOD = "#ae1c28";
const WIT = "#ffffff";
const BLAUW = "#21468b";

function useMinderBeweging(): boolean {
  const [minder, zetMinder] = useState(() => (typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false));
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const naar = () => zetMinder(mq.matches);
    mq.addEventListener("change", naar);
    return () => mq.removeEventListener("change", naar);
  }, []);
  return minder;
}

export function Knik({ open, grootte = 24, kleuren = "vlag" }: KnikProps) {
  const minder = useMinderBeweging();
  const basis: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };
  const kruis = (t: string): CSSProperties => ({ ...basis, transform: open ? t : "none", transition: minder ? "none" : "transform 220ms cubic-bezier(0.3, 0.7, 0.3, 1)" });
  const midden: CSSProperties = {
    ...basis,
    transform: open ? "translateX(0)" : "translateX(3px)",
    opacity: open ? 0 : 1,
    transition: minder ? "none" : open ? "transform 80ms ease-out, opacity 110ms ease-in 40ms" : "opacity 100ms ease-out 40ms, transform 130ms cubic-bezier(0.34, 1.56, 0.64, 1) 90ms",
  };
  const vlag = kleuren === "vlag";
  return (
    <svg viewBox="0 0 24 24" width={grootte} height={grootte} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="6" x2="19" y2="6" stroke={vlag ? ROOD : undefined} style={kruis("translateY(6px) rotate(45deg)")} />
      <line x1="5" y1="12" x2="19" y2="12" stroke={vlag ? WIT : undefined} style={midden} />
      <line x1="5" y1="18" x2="19" y2="18" stroke={vlag ? BLAUW : undefined} style={kruis("translateY(-6px) rotate(-45deg)")} />
    </svg>
  );
}
