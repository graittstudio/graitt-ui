import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Het grapje bij De Knik: één keer per dag, op een willekeurig moment terwijl de app openstaat
 * (15 s tot 3 min nadat het scherm met het menu opent), steekt een handje zijn hand achter de menuknop
 * vandaan en zwaait 2 seconden. Niet bij verminderde beweging en niet terwijl het menu open is.
 * Proef: de knop 0,7 s ingedrukt houden laat hem direct zwaaien (`proefProps`).
 *
 * Gebruik: zet `<ZwaaiHand zwaait={zwaait} />` in dezelfde `position: relative`-houder als de knop,
 * en spreid `proefProps` over de knop. Alleen inline stijl; het keyframe-blok zit in de component.
 */
const SLEUTEL = "grait-zwaai-dag";
export const ZWAAI_MS = 2600;

const vandaag = () => new Date().toISOString().slice(0, 10);

function lees(): string {
  try {
    return localStorage.getItem(SLEUTEL) ?? "";
  } catch {
    return "";
  }
}

function schrijf(dag: string) {
  try {
    localStorage.setItem(SLEUTEL, dag);
  } catch {
    /* geen opslag: dan zwaait hij hooguit vaker */
  }
}

const minderBeweging = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useZwaai(pauze: boolean) {
  const [zwaait, zetZwaait] = useState(false);
  const stopper = useRef<number | undefined>(undefined);
  const lang = useRef<number | undefined>(undefined);
  const pauzeRef = useRef(pauze);
  pauzeRef.current = pauze;

  const zwaaiNu = useCallback(() => {
    if (minderBeweging()) return;
    window.clearTimeout(stopper.current);
    zetZwaait(true);
    stopper.current = window.setTimeout(() => zetZwaait(false), ZWAAI_MS);
  }, []);

  useEffect(() => {
    if (lees() === vandaag()) return;
    const id = window.setTimeout(() => {
      if (pauzeRef.current || lees() === vandaag()) return;
      schrijf(vandaag());
      zwaaiNu();
    }, 15000 + Math.random() * 165000);
    return () => window.clearTimeout(id);
  }, [zwaaiNu]);

  useEffect(
    () => () => {
      window.clearTimeout(stopper.current);
      window.clearTimeout(lang.current);
    },
    [],
  );

  const proefProps = {
    onPointerDown: () => {
      window.clearTimeout(lang.current);
      lang.current = window.setTimeout(zwaaiNu, 700);
    },
    onPointerUp: () => window.clearTimeout(lang.current),
    onPointerLeave: () => window.clearTimeout(lang.current),
  };
  return { zwaait, zwaaiNu, proefProps };
}

const KEYFRAMES = `
@keyframes grait-zwaai-uit{0%{transform:translateX(34px)}10%,90%{transform:translateX(-2px)}100%{transform:translateX(34px)}}
@keyframes grait-zwaai-zwaai{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
`;

/** Het handje zelf: komt links van de knop uit een vakje vandaan (alsof het erachter zit). */
export function ZwaaiHand({ zwaait }: { zwaait: boolean }) {
  if (!zwaait) return null;
  return (
    <span aria-hidden="true" style={{ position: "absolute", right: "100%", top: 0, bottom: 0, width: 40, overflow: "hidden", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <style>{KEYFRAMES}</style>
      <span style={{ display: "inline-block", fontSize: 22, lineHeight: 1, animation: `grait-zwaai-uit ${ZWAAI_MS}ms ease-in-out both` }}>
        <span style={{ display: "inline-block", transformOrigin: "70% 90%", animation: "grait-zwaai-zwaai 260ms ease-in-out 280ms 7 alternate both" }}>👋</span>
      </span>
    </span>
  );
}
