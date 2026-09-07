import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FileSpreadsheet, FileText, Plus, Receipt } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { CategoryChip } from "../../components/CategoryChip";
import { ListRow } from "../../components/ListRow";
import type { CostModuleConfig } from "./config";
import { vindCategorie } from "./config";

export interface CostBooking {
  id: string;
  categoryId: string;
  bedrag: number;
  /** ISO-datum (yyyy-mm-dd). */
  datum: string;
  omschrijving?: string;
  /** Aanwezig als er een bon/foto bij deze boeking hoort - toont het bonicoon. */
  bonUrl?: string;
}

export interface Vehicle {
  id: string;
  label: string;
}

export type Period = "dit-jaar" | "vorig-jaar" | "sinds-aankoop" | "aangepast";

export interface CostOverviewProps {
  config: CostModuleConfig;
  /** Alle boekingen van het huidige voertuig (scope 'vehicle') of de actieve reis (scope 'trip'). Periode-/categoriefilter gebeurt hierbinnen. */
  bookings: CostBooking[];

  /** scope 'vehicle': voertuigselector. */
  vehicles?: Vehicle[];
  selectedVehicleId?: string;
  onSelectVehicle?: (id: string) => void;
  /** scope 'vehicle' + periode 'sinds-aankoop': nodig om die periode te kunnen tonen. */
  aankoopDatum?: string;

  /** scope 'trip': naam van de actieve reis i.p.v. voertuigselector/periodekiezer. */
  tripLabel?: string;

  /** Voor "kosten per km" - totaal afgelegde km in de getoonde periode. De module berekent dit niet zelf (kilometerstand-data hoort bij de app). */
  totaalAfgelegdeKm?: number;

  onOpenBooking: (id: string) => void;
  onAddBooking: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
}

const PERIOD_LABEL: Record<Period, string> = {
  "dit-jaar": "Dit jaar",
  "vorig-jaar": "Vorig jaar",
  "sinds-aankoop": "Sinds aankoop",
  aangepast: "Aangepast",
};

function inPeriode(datum: string, periode: Period, aankoopDatum: string | undefined, aangepast: { van: string; tot: string }): boolean {
  const d = new Date(datum);
  const nu = new Date();
  if (periode === "dit-jaar") return d.getFullYear() === nu.getFullYear();
  if (periode === "vorig-jaar") return d.getFullYear() === nu.getFullYear() - 1;
  if (periode === "sinds-aankoop") return aankoopDatum ? d >= new Date(aankoopDatum) : true;
  if (!aangepast.van || !aangepast.tot) return true;
  return d >= new Date(aangepast.van) && d <= new Date(aangepast.tot);
}

/**
 * Overzichtsscherm "Kosten". Verwijderen zit hier bewust niet in als losse
 * knop op de rij (risico op per-ongeluk-tikken) - een boeking openen (tik)
 * gaat naar de bewerkschermen, en dáár zit de "Verwijderen"-knop mét
 * bevestiging (zie CostEntryForm). Dat voldoet aan "verwijderen alleen via
 * swipe of met bevestiging" zonder een aparte swipe-gesture te bouwen.
 */
export function CostOverview({
  config,
  bookings,
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  aankoopDatum,
  tripLabel,
  totaalAfgelegdeKm,
  onOpenBooking,
  onAddBooking,
  onExportExcel,
  onExportPdf,
}: CostOverviewProps) {
  const [periode, setPeriode] = useState<Period>("dit-jaar");
  const [aangepast, setAangepast] = useState({ van: "", tot: "" });
  const [actieveCategorie, setActieveCategorie] = useState<string | "alle">("alle");

  const isVehicleScope = config.scope === "vehicle";

  const inPeriodeBoekingen = useMemo(
    () =>
      isVehicleScope
        ? bookings.filter((b) => inPeriode(b.datum, periode, aankoopDatum, aangepast))
        : bookings,
    [bookings, isVehicleScope, periode, aankoopDatum, aangepast],
  );

  const gefilterd =
    actieveCategorie === "alle"
      ? inPeriodeBoekingen
      : inPeriodeBoekingen.filter((b) => b.categoryId === actieveCategorie);

  const totaal = inPeriodeBoekingen.reduce((s, b) => s + b.bedrag, 0);

  const perCategorie = useMemo(() => {
    const m = new Map<string, number>();
    inPeriodeBoekingen.forEach((b) => m.set(b.categoryId, (m.get(b.categoryId) ?? 0) + b.bedrag));
    return Array.from(m.entries())
      .map(([id, waarde]) => {
        const c = vindCategorie(config, id);
        return { id, naam: c?.label ?? id, kleur: c?.color ?? "#a3a3a3", waarde };
      })
      .filter((c) => c.waarde > 0);
  }, [inPeriodeBoekingen, config]);

  const gemiddeldPerMaand = useMemo(() => {
    if (inPeriodeBoekingen.length === 0) return 0;
    const maanden = new Set(inPeriodeBoekingen.map((b) => b.datum.slice(0, 7))).size || 1;
    return totaal / maanden;
  }, [inPeriodeBoekingen, totaal]);

  const kostenPerKmWaarde =
    totaalAfgelegdeKm && totaalAfgelegdeKm > 0 ? totaal / totaalAfgelegdeKm : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {isVehicleScope ? (
          vehicles && vehicles.length > 0 && (
            <select
              value={selectedVehicleId}
              onChange={(e) => onSelectVehicle?.(e.target.value)}
              className="min-h-tap rounded-xl border border-input bg-card px-3 text-sm"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          )
        ) : (
          <div className="text-sm font-semibold text-muted-foreground">{tripLabel}</div>
        )}
        <Button onClick={onAddBooking}>
          <Plus className="h-4 w-4" /> Boeking
        </Button>
      </div>

      {isVehicleScope && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className={`min-h-tap shrink-0 rounded-full border px-4 text-xs font-semibold ${
                periode === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
              }`}
            >
              {PERIOD_LABEL[p]}
            </button>
          ))}
          {periode === "aangepast" && (
            <div className="flex shrink-0 gap-1">
              <input
                type="date"
                value={aangepast.van}
                onChange={(e) => setAangepast((a) => ({ ...a, van: e.target.value }))}
                className="min-h-tap rounded-xl border border-input bg-card px-2 text-xs"
              />
              <input
                type="date"
                value={aangepast.tot}
                onChange={(e) => setAangepast((a) => ({ ...a, tot: e.target.value }))}
                className="min-h-tap rounded-xl border border-input bg-card px-2 text-xs"
              />
            </div>
          )}
        </div>
      )}

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              {isVehicleScope ? "Totaal " + PERIOD_LABEL[periode].toLowerCase() : "Totaal deze reis"}
            </div>
            <div className="text-2xl font-bold">€ {totaal.toFixed(2)}</div>
          </div>
          <div className="flex gap-1">
            <Button variant="secondary" onClick={onExportExcel} className="px-3 py-1.5 text-xs">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </Button>
            <Button variant="secondary" onClick={onExportPdf} className="px-3 py-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" /> PDF
            </Button>
          </div>
        </div>

        {perCategorie.length > 0 && (
          <div className="h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={perCategorie} dataKey="waarde" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {perCategorie.map((c) => (
                    <Cell key={c.id} fill={c.kleur} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `€ ${Number(v).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {isVehicleScope && (
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            {kostenPerKmWaarde !== undefined && <span>€ {kostenPerKmWaarde.toFixed(2)} / km</span>}
            <span>€ {gemiddeldPerMaand.toFixed(2)} / maand gemiddeld</span>
          </div>
        )}
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <CategoryChip
          label="Alle"
          color="var(--grait-muted-foreground)"
          selected={actieveCategorie === "alle"}
          onClick={() => setActieveCategorie("alle")}
        />
        {config.categories.map((c) => (
          <CategoryChip
            key={c.id}
            label={c.label}
            color={c.color}
            selected={actieveCategorie === c.id}
            onClick={() => setActieveCategorie(c.id)}
          />
        ))}
      </div>

      {gefilterd.length === 0 ? (
        <Card className="text-center text-sm text-muted-foreground">Geen boekingen in deze periode.</Card>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {gefilterd.length} boekingen · € {gefilterd.reduce((s, b) => s + b.bedrag, 0).toFixed(2)}
          </div>
          {gefilterd.map((b) => {
            const c = vindCategorie(config, b.categoryId);
            return (
              <ListRow
                key={b.id}
                markerColor={c?.color}
                onClick={() => onOpenBooking(b.id)}
                title={
                  <>
                    € {b.bedrag.toFixed(2)} <span className="font-normal text-muted-foreground">· {c?.label ?? b.categoryId}</span>
                  </>
                }
                subtitle={
                  new Date(b.datum).toLocaleDateString("nl-NL") + (b.omschrijving ? ` · ${b.omschrijving}` : "")
                }
                trailing={b.bonUrl ? <Receipt className="h-4 w-4 text-muted-foreground" /> : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
