import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Blokkerende bevestiging voor onomkeerbare acties (bv. een boeking
 * verwijderen) - nooit een losse prullenbak-knop zonder deze stap ertussen.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Verwijderen",
  cancelLabel = "Annuleren",
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" role="dialog" aria-modal="true">
      {/* Onderin de ruimte van de navigatiebalk van de telefoon erbij. Zonder dat
          vallen de knoppen op Android 15 en later achter de terugknop en de
          veegbalk, want de app tekent daar sinds die versie onder door. Op een
          scherm zonder zo'n balk is de extra ruimte nul. */}
      <div className="w-full max-w-sm rounded-t-2xl bg-card p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] text-card-foreground sm:rounded-2xl sm:pb-5">
        <div className="mb-1 text-lg font-semibold">{title}</div>
        {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "destructive" : "primary"} className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
