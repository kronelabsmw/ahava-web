export type PageImageKey =
  | "aboutHero"
  | "eventsHero"
  | "eventsProcessStep1"
  | "eventsProcessStep2"
  | "eventsProcessStep3"
  | "eventsProcessStep4"
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
  eventsProcessStep1: {
    label: "Events process — Consultation",
    description: "Image for step 1 (Consultation) on the Events Process tab",
    path: "/events",
  },
  eventsProcessStep2: {
    label: "Events process — Planning",
    description: "Image for step 2 (Planning) on the Events Process tab",
    path: "/events",
  },
  eventsProcessStep3: {
    label: "Events process — Coordination",
    description: "Image for step 3 (Coordination) on the Events Process tab",
    path: "/events",
  },
  eventsProcessStep4: {
    label: "Events process — Celebration",
    description: "Image for step 4 (Celebration) on the Events Process tab",
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
  eventsProcessStep1:
    "https://images.unsplash.com/photo-1511285560929-80b456fe9ea0?auto=format&fit=crop&q=80&w=800",
  eventsProcessStep2:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800",
  eventsProcessStep3:
    "https://images.unsplash.com/photo-1519167758481-83f29da8c2d5?auto=format&fit=crop&q=80&w=800",
  eventsProcessStep4:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  fittingsHero:
    "https://images.unsplash.com/photo-1594552072238-ee4a123b4c4c?auto=format&fit=crop&q=80&w=1200",
  customOrdersHero:
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d6a?auto=format&fit=crop&q=80&w=1200",
  hireProcessHero:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
};

const LEGACY_PROCESS_KEY = "eventsProcess";

export function parsePageImages(raw: unknown): PageImages {
  const base = { ...DEFAULT_PAGE_IMAGES };
  if (!raw) return base;
  try {
    const parsed: Partial<PageImages> & Record<string, string> =
      typeof raw === "string"
        ? (JSON.parse(raw) as Partial<PageImages> & Record<string, string>)
        : (raw as Partial<PageImages> & Record<string, string>);
    if (typeof parsed === "object" && parsed !== null) {
      for (const key of Object.keys(PAGE_IMAGE_META) as PageImageKey[]) {
        if (typeof parsed[key] === "string" && parsed[key]) {
          base[key] = parsed[key]!;
        }
      }
      // Migrate legacy single process image onto step 2 if step keys are empty
      if (
        typeof parsed[LEGACY_PROCESS_KEY] === "string" &&
        parsed[LEGACY_PROCESS_KEY] &&
        !parsed.eventsProcessStep2
      ) {
        base.eventsProcessStep2 = parsed[LEGACY_PROCESS_KEY];
      }
    }
  } catch {
    /* use defaults */
  }
  return base;
}

export const DEFAULT_EVENTS_GALLERY: string[] = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1519167758481-83f29da8c2d5?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1000",
];

export function parseEventsGallery(raw: unknown): string[] {
  if (!raw) return [...DEFAULT_EVENTS_GALLERY];
  try {
    const parsed: unknown =
      typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [...DEFAULT_EVENTS_GALLERY];
    const urls = parsed.filter(
      (item): item is string => typeof item === "string" && item.trim().length > 0
    );
    return urls.length > 0 ? urls : [...DEFAULT_EVENTS_GALLERY];
  } catch {
    return [...DEFAULT_EVENTS_GALLERY];
  }
}
