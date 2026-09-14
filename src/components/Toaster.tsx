import { useEffect, useState } from "react";

/**
 * Korte meldingen onderin het scherm: een bevestiging ("Opgeslagen") of iets
 * wat een ander deed ("Nieuwe uitgave van Jacqueline"). Komt uit TravelSpendGo
 * (travelspendgo#63).
 *
 * Een melding tonen kan van overal, ook buiten React, met `showToast`. Zet
 * `<Toaster />` één keer in de schil van de app. Meldingen gaan na een paar
 * seconden vanzelf weg, of met een tik; er staan er nooit meer dan drie.
 *
 * `bottomOffset` houdt de meldingen boven een tabbalk. De ruimte voor de
 * navigatiebalk van de telefoon komt er altijd bij.
 */

const EVENT = "grait:toast";

export function showToast(text: string): void {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: text }));
}

export interface ToasterProps {
  /** Hoe lang een melding blijft staan. */
  durationMs?: number;
  /** Ruimte onderin, bijvoorbeeld de hoogte van een tabbalk, als CSS-lengte. */
  bottomOffset?: string;
  /** Een icoon vooraan in elke melding. */
  icon?: React.ReactNode;
  /** Label voor schermlezers bij het wegtikken. */
  dismissLabel?: string;
}

interface Toast {
  id: number;
  text: string;
}

let next = 0;

export function Toaster({ durationMs = 5000, bottomOffset = "4.5rem", icon, dismissLabel }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const onToast = (event: Event) => {
      const id = ++next;
      const text = (event as CustomEvent<string>).detail;
      setToasts((current) => [...current.slice(-2), { id, text }]);
      window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), durationMs);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, [durationMs]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-40 flex flex-col items-center gap-2 px-4"
      style={{ bottom: `calc(env(safe-area-inset-bottom) + ${bottomOffset})` }}
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          aria-label={dismissLabel}
          onClick={() => setToasts((current) => current.filter((other) => other.id !== toast.id))}
          className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-left text-sm font-semibold text-primary-foreground shadow-xl"
        >
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="flex-1">{toast.text}</span>
        </button>
      ))}
    </div>
  );
}
