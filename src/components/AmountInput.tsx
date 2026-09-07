import { forwardRef, type InputHTMLAttributes } from "react";

export interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "inputMode"> {}

/**
 * Bedrag-invoerveld: numeriek toetsenbord, komma of punt toegestaan.
 * Autofocus is aan de consumer (props.autoFocus) - deze component forceert dat niet zelf.
 */
export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(function AmountInput(
  { className = "", placeholder = "0,00", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      className={`min-h-tap w-full rounded-xl border border-input bg-card p-3 text-2xl font-bold text-foreground outline-none focus:border-primary ${className}`}
      {...props}
    />
  );
});
