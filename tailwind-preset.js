/**
 * Gedeelde Tailwind-preset voor grAItt Studio's apps. Verwijst naar de
 * CSS-variabelen uit src/tokens/tokens.css (die moet de consumerende app
 * zelf importeren) zodat licht/donker-thema's werken zonder duplicatie.
 *
 * Gebruik in een app se tailwind.config.js:
 *   import graitPreset from "@grait/ui/tailwind-preset";
 *   export default { presets: [graitPreset], content: [...] };
 */

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        background: "var(--grait-background)",
        foreground: "var(--grait-foreground)",
        card: {
          DEFAULT: "var(--grait-card)",
          foreground: "var(--grait-card-foreground)",
        },
        primary: {
          DEFAULT: "var(--grait-primary)",
          foreground: "var(--grait-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--grait-secondary)",
          foreground: "var(--grait-secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--grait-accent)",
          foreground: "var(--grait-accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--grait-muted)",
          foreground: "var(--grait-muted-foreground)",
        },
        border: "var(--grait-border)",
        input: "var(--grait-input)",
        ring: "var(--grait-ring)",
        surface: {
          DEFAULT: "var(--grait-surface)",
          2: "var(--grait-surface-2)",
        },
        destructive: {
          DEFAULT: "var(--grait-destructive)",
          foreground: "var(--grait-destructive-foreground)",
        },
        warn: {
          DEFAULT: "var(--grait-warn)",
          foreground: "var(--grait-warn-foreground)",
        },
        success: {
          DEFAULT: "var(--grait-success)",
          foreground: "var(--grait-success-foreground)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--grait-radius)",
      },
      minHeight: {
        tap: "44px",
      },
      minWidth: {
        tap: "44px",
      },
    },
  },
};
