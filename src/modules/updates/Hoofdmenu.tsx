import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Het hamburgermenu rechtsboven, met een rood bolletje als er iets is (een
 * nieuwe versie). Het bolletje zit op de knop én bij de regel waar de melding
 * staat, zodat het de weg wijst in plaats van alleen te zeggen dat er iets is.
 * Dezelfde route als in TravelCareGo en TripSpendGo.
 *
 * Inline stijl via de `--grait-*`-variabelen met terugvalwaarden, zodat het
 * ook werkt in een app zonder de Tailwind-preset.
 */

export interface MenuItem {
  sleutel: string;
  label: string;
  icoon?: ReactNode;
  /** Rood bolletje bij deze regel. */
  bolletje?: boolean;
  onKies: () => void;
}

export interface HoofdmenuProps {
  items: MenuItem[];
  /** Rood bolletje op de hamburgerknop zelf. */
  bolletje?: boolean;
  /** Voor schermlezers, bv. "Menu". */
  label: string;
  /** Extra stijl voor de knop, bv. een glazen achtergrond. */
  knopStijl?: CSSProperties;
  knopKlasse?: string;
}

export const ROOD = "var(--grait-destructive, #df202e)";

export function Bolletje({ stijl }: { stijl?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{ display: "inline-block", width: 10, height: 10, borderRadius: 999, background: ROOD, flexShrink: 0, ...stijl }}
    />
  );
}

function Hamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Hoofdmenu({ items, bolletje, label, knopStijl, knopKlasse }: HoofdmenuProps) {
  const [open, zetOpen] = useState(false);
  const knop = useRef<HTMLButtonElement>(null);

  // Escape sluit het menu en zet de aandacht terug op de knop.
  useEffect(() => {
    if (!open) return;
    const toets = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        zetOpen(false);
        knop.current?.focus();
      }
    };
    document.addEventListener("keydown", toets);
    return () => document.removeEventListener("keydown", toets);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={knop}
        type="button"
        onClick={() => zetOpen((was) => !was)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={knopKlasse}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 44,
          minHeight: 44,
          borderRadius: 999,
          border: "none",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          ...knopStijl,
        }}
      >
        <Hamburger />
        {bolletje && <Bolletje stijl={{ position: "absolute", top: 8, right: 8, boxShadow: "0 0 0 2px var(--grait-card, #fff)" }} />}
      </button>

      {open && (
        <>
          {/* Een tik naast het menu sluit het; ligt onder het menu zelf. */}
          <div aria-hidden="true" onClick={() => zetOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <ul
            role="menu"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 0.5rem)",
              zIndex: 41,
              minWidth: "14rem",
              margin: 0,
              padding: 0,
              listStyle: "none",
              overflow: "hidden",
              background: "var(--grait-card, #ffffff)",
              color: "var(--grait-card-foreground, #111b28)",
              border: "1px solid var(--grait-border, #dcd7cd)",
              borderRadius: "var(--grait-radius, 1.1rem)",
              boxShadow: "0 18px 40px -12px rgba(0,0,0,.35)",
            }}
          >
            {items.map((item, i) => (
              <li key={item.sleutel} role="none" style={{ borderTop: i ? "1px solid var(--grait-border, #dcd7cd)" : undefined }}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    zetOpen(false);
                    item.onKies();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    minHeight: 48,
                    padding: "0.75rem 1rem",
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    font: "inherit",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {item.icoon && <span style={{ display: "flex", opacity: 0.8 }}>{item.icoon}</span>}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.bolletje && <Bolletje />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
