export type PageImageKey =
  | "aboutHero"
  | "eventsHero"
  | "eventsProcess"
  | "fittingsHero"
  | "customOrdersHero"
  | "hireProcessHero";

export type PageImages = Record<PageImageKey, string>;

export const PAGE_IMAGE_META: Record<
  PageImageKey,
  { label: string; description: string; path: string }
> = {
  aboutHero: {
    label: "About page",
    description: "Main image beside the about story",
    path: "/about",
  },
  eventsHero: {
    label: "Events hero",
    description: "Full-width banner on the Events page",
    path: "/events",
  },
  eventsProcess: {
    label: "Events process",
    description: "Image beside the planning steps section",
    path: "/events",
  },
  fittingsHero: {
    label: "Fittings page",
    description: "Hero image for the fittings page",
    path: "/fittings",
  },
  customOrdersHero: {
    label: "Custom orders",
    description: "Hero image for the custom orders page",
    path: "/custom-orders",
  },
  hireProcessHero: {
    label: "Hire process",
    description: "Optional banner for the hire process page",
    path: "/hire-process",
  },
};

export const DEFAULT_PAGE_IMAGES: PageImages = {
  aboutHero:
    "https://images.unsplash.com/photo-1546804784-896d0b1ea386?auto=format&fit=crop&q=80&w=1200",
  eventsHero:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600",
  eventsProcess:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
  fittingsHero:
    "https://images.unsplash.com/photo-1594552072238-ee4a123b4c4c?auto=format&fit=crop&q=80&w=1200",
  customOrdersHero:
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d6a?auto=format&fit=crop&q=80&w=1200",
  hireProcessHero:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
};

export function parsePageImages(raw: unknown): PageImages {
  const base = { ...DEFAULT_PAGE_IMAGES };
  if (!raw) return base;
  try {
    const parsed: Partial<PageImages> =
      typeof raw === "string"
        ? (JSON.parse(raw) as Partial<PageImages>)
        : (raw as Partial<PageImages>);
    if (typeof parsed === "object" && parsed !== null) {
      for (const key of Object.keys(PAGE_IMAGE_META) as PageImageKey[]) {
        if (typeof parsed[key] === "string" && parsed[key]) {
          base[key] = parsed[key]!;
        }
      }
    }
  } catch {
    /* use defaults */
  }
  return base;
}
