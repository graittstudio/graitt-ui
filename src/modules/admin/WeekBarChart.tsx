export interface WeekBarChartPunt {
  /** ISO-datum (yyyy-mm-dd) van het begin van de periode - wordt kort geformatteerd (dd-mm) als aslabel. */
  datum: string;
  waarde: number;
}

export interface WeekBarChartProps {
  data: WeekBarChartPunt[];
  /** Staafkleur, standaard var(--grait-primary). */
  kleur?: string;
  /** Taal voor de datumnotatie op de as, standaard "nl-NL". */
  taal?: string;
}

/**
 * Simpel staafdiagram voor tijdreeksen (#166, gedistilleerd uit
 * TravelCareGo's admin-statistieken - #19), puur CSS - geen chart-library,
 * zelfde aanpak als de taartdiagram-vervanging in de kostenmodule (#164).
 */
export function WeekBarChart({ data, kleur, taal = "nl-NL" }: WeekBarChartProps) {
  const max = Math.max(1, ...data.map((p) => p.waarde));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4rem", height: "5rem" }}>
      {data.map((punt) => (
        <div
          key={punt.datum}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
        >
          <div
            title={String(punt.waarde)}
            style={{
              width: "100%",
              height: `${Math.max(4, (punt.waarde / max) * 64)}px`,
              background: kleur ?? "var(--grait-primary)",
              borderRadius: "0.25rem 0.25rem 0 0",
            }}
          />
          <span style={{ fontSize: "0.62rem", opacity: 0.6 }}>
            {new Date(punt.datum).toLocaleDateString(taal, { day: "2-digit", month: "2-digit" })}
          </span>
        </div>
      ))}
    </div>
  );
}
