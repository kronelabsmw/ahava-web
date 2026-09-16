import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

/* ==================== SPACING ==================== */

/** Standard page padding */
export const storePagePaddingClass = "py-8 md:py-10 lg:py-12";

/** Space between stacked sections (top padding only — avoids doubled gaps) */
export const storeSectionSpacingClass =
  "pt-8 md:pt-10 lg:pt-12 [&:first-child]:pt-0";

/** Large block padding inside a section */
export const storeCompactSectionClass = "py-6 md:py-8";

/** Bottom page CTA strip */
export const storePageFooterClass =
  "border-t border-border py-10 text-center md:py-12";

/* ==================== CARDS & PANELS ==================== */

/** Visible card surface - solid border + soft elevation */
export const storeCardClass =
  "rounded-2xl border border-border bg-card shadow-[0_2px_8px_rgba(44,36,32,0.08),0_12px_32px_rgba(44,36,32,0.06)]";

export const storeCardHoverClass =
  "transition-all duration-300 hover:border-primary hover:shadow-[0_8px_32px_rgba(184,149,134,0.22)]";

/** Interactive card - border, elevated on hover */
export const storeInteractiveCardClass = cn(
  storeCardClass,
  storeCardHoverClass,
  "cursor-pointer"
);

export const storePanelClass =
  "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[0_2px_8px_rgba(44,36,32,0.08),0_12px_32px_rgba(44,36,32,0.06)]";

export const storeInsetClass =
  "rounded-xl border border-border bg-secondary/70 p-5 sm:p-6";

/* ==================== DIVIDERS ==================== */

export const storeDividerClass = "border-t border-border";

export const storeHeaderDividerClass = "border-b border-border";

/* ==================== SECTIONS ==================== */

/** Standard section spacing - use this for all page sections */
export const storeSectionClass = storeSectionSpacingClass;

export const storePageIntroClass = "mb-8 md:mb-10";

/* ==================== TYPOGRAPHY & ACCENTS ==================== */

/** Blush accent bar beside headings */
export const storeAccentBarClass =
  "mt-2 h-12 w-1.5 shrink-0 rounded-full bg-primary";

/** Icon container for section headers */
export const storeIconWrapClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30";

/** Step number badge */
export const storeStepBadgeClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md";

/** Pill badge - solid brand color */
export const storeBadgeClass =
  "inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground";

/** Muted pill */
export const storeBadgeMutedClass =
  "inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-foreground";

/* ==================== HEADINGS ==================== */

/** Main page heading */
export const storeHeadingLgClass =
  "font-sans text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl";

/** Section heading */
export const storeHeadingMdClass =
  "font-sans text-3xl font-semibold tracking-tight md:text-4xl";

/** Subsection heading */
export const storeHeadingSmClass =
  "font-sans text-2xl font-semibold tracking-tight";

/** Card / panel title */
export const storeHeadingXsClass =
  "font-sans text-xl font-semibold tracking-tight";

/** Compact label heading (filters, sidebar) */
export const storeHeadingLabelClass =
  "font-sans text-lg font-semibold tracking-tight";

/** Large stat or decorative numeral */
export const storeStatValueClass =
  "font-sans text-4xl font-semibold leading-none tabular-nums tracking-tight";

/** Body text - muted */
export const storeTextMutedClass = "text-foreground/70 md:text-lg";

/* ==================== HELPER FUNCTIONS ==================== */

export function storeCard(...inputs: ClassValue[]) {
  return cn(storeCardClass, storeCardHoverClass, ...inputs);
}

export function storePanel(...inputs: ClassValue[]) {
  return cn(storePanelClass, ...inputs);
}
