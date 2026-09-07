import { useEffect, useRef, useState } from "react";
import { Paperclip, Trash2 } from "lucide-react";
import { Button } from "../../components/Button";
import { AmountInput } from "../../components/AmountInput";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import type { CostModuleConfig } from "./config";

export interface CostFormValue {
  categoryId: string;
  bedrag: string;
  datum: string;
  omschrijving: string;
  /** Nieuw gekozen bonbestand (foto of PDF) - de consumer regelt de daadwerkelijke upload. */
  bonBestand?: File | null;
  /** Bestaande bon bij bewerken - alleen om te tonen, niet om te wijzigen. */
  bonUrl?: string;
  /** Alleen relevant als de gekozen categorie fuel:true heeft. */
  kmStand?: string;
  liters?: string;
  volleTank?: boolean;
}

export interface CostEntryFormProps {
  config: CostModuleConfig;
  /** Meegeven bij bewerken van een bestaande boeking; leeg voor een nieuwe. */
  initialValue?: Partial<CostFormValue>;
  onSave: (value: CostFormValue) => void;
  onCancel: () => void;
  /** Alleen tonen als dit meegegeven is (dus alleen in bewerk-modus). */
  onDelete?: () => void;
  /**
   * GPS-locatie opvragen - de module doet zelf geen geolocation-aanroep
   * (permissie-afhandeling hoort in de app). Wordt automatisch aangeroepen
   * bij een NIEUWE boeking (niet bij bewerken van een bestaande), en vult
   * de omschrijving alleen als die nog leeg is.
   */
  onRequestLocation?: () => Promise<{ plaatsnaam: string } | null>;
}

function vandaagIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CostEntryForm({
  config,
  initialValue,
  onSave,
  onCancel,
  onDelete,
  onRequestLocation,
}: CostEntryFormProps) {
  const isBewerken = initialValue !== undefined;
  const [categoryId, setCategoryId] = useState(initialValue?.categoryId ?? config.categories[0]?.id ?? "");
  const [bedrag, setBedrag] = useState(initialValue?.bedrag ?? "");
  const [datum, setDatum] = useState(initialValue?.datum ?? vandaagIso());
  const [omschrijving, setOmschrijving] = useState(initialValue?.omschrijving ?? "");
  const [bonBestand, setBonBestand] = useState<File | null>(null);
  const [kmStand, setKmStand] = useState(initialValue?.kmStand ?? "");
  const [liters, setLiters] = useState(initialValue?.liters ?? "");
  const [volleTank, setVolleTank] = useState(initialValue?.volleTank ?? true);
  const [bevestigVerwijderen, setBevestigVerwijderen] = useState(false);
  const bedragRef = useRef<HTMLInputElement>(null);

  const categorie = config.categories.find((c) => c.id === categoryId);

  useEffect(() => {
    bedragRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isBewerken || !onRequestLocation) return;
    onRequestLocation().then((locatie) => {
      if (locatie && !omschrijvingRef.current) setOmschrijving(locatie.plaatsnaam);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Ref zodat de GPS-callback (die soms pas na re-renders binnenkomt) de
  // ACTUELE omschrijving ziet i.p.v. de waarde van het moment van aanroepen.
  const omschrijvingRef = useRef(omschrijving);
  omschrijvingRef.current = omschrijving;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !bedrag.trim()) return;
    onSave({
      categoryId,
      bedrag,
      datum,
      omschrijving,
      bonBestand,
      bonUrl: initialValue?.bonUrl,
      ...(categorie?.fuel ? { kmStand, liters, volleTank } : {}),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">Categorie</span>
        <div className="grid grid-cols-2 gap-2">
          {config.categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setCategoryId(c.id)}
              className={`min-h-tap rounded-2xl border px-3 py-2.5 text-sm font-semibold ${
                categoryId === c.id ? "border-primary bg-primary/10 text-primary" : "border-border"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">Bedrag</span>
        <AmountInput ref={bedragRef} value={bedrag} onChange={(e) => setBedrag(e.target.value)} />
      </label>

      {categorie?.fuel && (
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border p-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Km-stand</span>
            <input
              inputMode="numeric"
              value={kmStand}
              onChange={(e) => setKmStand(e.target.value)}
              className="min-h-tap w-full rounded-xl border border-input bg-card p-2.5 outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Liters</span>
            <input
              inputMode="decimal"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              className="min-h-tap w-full rounded-xl border border-input bg-card p-2.5 outline-none focus:border-primary"
            />
          </label>
          <label className="col-span-2 flex min-h-tap items-center gap-2 text-sm">
            <input type="checkbox" checked={volleTank} onChange={(e) => setVolleTank(e.target.checked)} />
            Volle tank
          </label>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">Datum</span>
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          className="min-h-tap w-full rounded-xl border border-input bg-card p-3 outline-none focus:border-primary"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">Omschrijving (optioneel)</span>
        <input
          value={omschrijving}
          onChange={(e) => setOmschrijving(e.target.value)}
          className="min-h-tap w-full rounded-xl border border-input bg-card p-3 outline-none focus:border-primary"
        />
      </label>

      <label className="flex min-h-tap items-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
        <Paperclip className="h-4 w-4 shrink-0" />
        {bonBestand?.name ?? (initialValue?.bonUrl ? "Bon aanwezig - kies een bestand om te vervangen" : "Bon toevoegen (foto of PDF)")}
        <input
          type="file"
          accept="image/*,application/pdf"
          capture="environment"
          className="hidden"
          onChange={(e) => setBonBestand(e.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          Annuleren
        </Button>
        <Button type="submit" className="flex-1">
          Opslaan
        </Button>
      </div>

      {onDelete && (
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => setBevestigVerwijderen(true)}
        >
          <Trash2 className="h-4 w-4" /> Verwijderen
        </Button>
      )}

      <ConfirmDialog
        open={bevestigVerwijderen}
        title="Boeking verwijderen?"
        description="Dit kan niet ongedaan gemaakt worden."
        onCancel={() => setBevestigVerwijderen(false)}
        onConfirm={() => {
          setBevestigVerwijderen(false);
          onDelete?.();
        }}
      />
    </form>
  );
}
