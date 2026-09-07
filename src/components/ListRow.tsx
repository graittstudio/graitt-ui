import type { ReactNode } from "react";

export interface ListRowProps {
  /** Kleurbolletje vooraan, meestal de categoriekleur. */
  markerColor?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Bv. een bonicoon of chevron, rechts uitgelijnd. */
  trailing?: ReactNode;
  onClick?: () => void;
}

export function ListRow({ markerColor, title, subtitle, trailing, onClick }: ListRowProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left ${onClick ? "min-h-tap active:opacity-70" : ""}`}
    >
      {markerColor && <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: markerColor }} />}
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-card-foreground">{title}</div>
        {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Tag>
  );
}
