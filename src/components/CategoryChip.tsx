import type { ButtonHTMLAttributes } from "react";

export interface CategoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  color: string;
  selected?: boolean;
}

/** Horizontaal-scrollbare filterchip, met een gekleurd bolletje voor de categorie. */
export function CategoryChip({ label, color, selected = false, className = "", ...props }: CategoryChipProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-tap shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold ${
        selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground"
      } ${className}`}
      {...props}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
      {label}
    </button>
  );
}
