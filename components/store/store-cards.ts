import { cn } from "@/lib/utils";

/** Rich surface accents for editorial cards */
export const storeCardAccents = {
  blush:
    "border-primary/25 bg-gradient-to-br from-primary/14 via-card to-secondary/40",
  cream:
    "border-border bg-gradient-to-br from-secondary/80 via-card to-background",
  bronze:
    "border-[#c9a89a]/35 bg-gradient-to-br from-[#f0e4dc] via-card to-secondary/50",
  espresso:
    "border-[#3d342e]/20 bg-gradient-to-br from-[#3d342e] via-[#4a4038] to-[#3d342e] text-white",
} as const;

export type StoreCardAccent = keyof typeof storeCardAccents;

export const storeTierStyles = {
  silver: {
    badge: "bg-background/90 text-stone-700 shadow-sm backdrop-blur-sm",
    bar: "bg-stone-400",
    border: "border-stone-200/80",
    accent: "text-stone-700",
    inset: "bg-stone-100/70",
    header: "from-stone-100/90 via-card to-secondary/30",
  },
  gold: {
    badge: "bg-primary/95 text-primary-foreground shadow-sm backdrop-blur-sm",
    bar: "bg-primary",
    border: "border-primary/25",
    accent: "text-primary",
    inset: "bg-primary/8",
    header: "from-primary/20 via-card to-secondary/40",
  },
  platinum: {
    badge: "bg-[#3d342e]/90 text-white shadow-sm backdrop-blur-sm",
    bar: "bg-[#3d342e]",
    border: "border-[#3d342e]/15",
    accent: "text-[#3d342e]",
    inset: "bg-[#3d342e]/5",
    header: "from-[#e8ddd4] via-card to-secondary/50",
  },
  default: {
    badge: "bg-background/90 text-foreground shadow-sm backdrop-blur-sm",
    bar: "bg-border",
    border: "border-border",
    accent: "text-primary",
    inset: "bg-secondary/60",
    header: "from-secondary/60 via-card to-background",
  },
} as const;

export const packageTierLabels: Record<keyof typeof storeTierStyles, string> = {
  silver: "Essential",
  gold: "Popular",
  platinum: "Premium",
  default: "Package",
};

export function getPackageTierKey(name: string): keyof typeof storeTierStyles {
  const lower = name.toLowerCase();
  if (lower.includes("platinum")) return "platinum";
  if (lower.includes("gold")) return "gold";
  if (lower.includes("silver")) return "silver";
  return "default";
}

export function storeRichCard(
  accent: StoreCardAccent = "cream",
  ...inputs: Parameters<typeof cn>
) {
  return cn(
    "overflow-hidden rounded-2xl border shadow-[0_4px_20px_rgba(44,36,32,0.08)]",
    storeCardAccents[accent],
    ...inputs
  );
}
