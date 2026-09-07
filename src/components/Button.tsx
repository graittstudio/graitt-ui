import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "bg-transparent text-foreground border border-border",
  destructive: "bg-destructive text-destructive-foreground",
};

/** Standaard tap-knop - minHeight tap (44px) zit al in de preset. */
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-tap items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}
