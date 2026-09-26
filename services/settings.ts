import { prisma } from "@/lib/prisma";
import { APP_NAME, APP_TAGLINE, WHATSAPP_FULL } from "@/lib/constants";
import {
  DEFAULT_EVENTS_GALLERY,
  DEFAULT_PAGE_IMAGES,
  parseEventsGallery,
  parsePageImages,
  type PageImages,
} from "@/lib/page-images";
import {
  DEFAULT_SITE_VIDEOS,
  parseSiteVideos,
  type SiteVideos,
} from "@/lib/site-videos";

export type SiteSettings = {
  shopName: string;
  tagline: string;
  whatsapp: string;
  heroImages: string[];
  eventsGallery: string[];
  pageImages: PageImages;
  siteVideos: SiteVideos;
};

const DEFAULT_SETTINGS: SiteSettings = {
  shopName: APP_NAME,
  tagline: APP_TAGLINE,
  whatsapp: WHATSAPP_FULL,
  heroImages: [],
  eventsGallery: DEFAULT_EVENTS_GALLERY,
  pageImages: DEFAULT_PAGE_IMAGES,
  siteVideos: DEFAULT_SITE_VIDEOS,
};

/** Raw string defaults for DB seeding / getSetting fallback */
const defaults: Record<string, string> = {
  shopName: APP_NAME,
  tagline: APP_TAGLINE,
  whatsapp: WHATSAPP_FULL,
  heroImages: JSON.stringify([]),
  eventsGallery: JSON.stringify(DEFAULT_EVENTS_GALLERY),
  pageImages: JSON.stringify(DEFAULT_PAGE_IMAGES),
  siteVideos: JSON.stringify(DEFAULT_SITE_VIDEOS),
};

export async function getSetting(key: string) {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? defaults[key] ?? "";
  } catch {
    return defaults[key] ?? "";
  }
}

function parseStringArray(raw: unknown, fallback: string[]): string[] {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : fallback;
    } catch {
      return fallback;
    }
  }
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string");
  }
  return fallback;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, unknown> = { ...defaults };
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    map.pageImages = parsePageImages(map.pageImages);
    map.siteVideos = parseSiteVideos(map.siteVideos);

    return {
      shopName: String(map.shopName ?? DEFAULT_SETTINGS.shopName),
      tagline: String(map.tagline ?? DEFAULT_SETTINGS.tagline),
      whatsapp: String(map.whatsapp ?? DEFAULT_SETTINGS.whatsapp),
      heroImages: parseStringArray(map.heroImages, DEFAULT_SETTINGS.heroImages),
      eventsGallery: parseEventsGallery(map.eventsGallery),
      pageImages: map.pageImages as PageImages,
      siteVideos: map.siteVideos as SiteVideos,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getHeroImages(): Promise<string[]> {
  try {
    const raw = await getSetting("heroImages");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export async function getEventsGallery(): Promise<string[]> {
  const raw = await getSetting("eventsGallery");
  return parseEventsGallery(raw);
}

export async function getPageImages(): Promise<PageImages> {
  const raw = await getSetting("pageImages");
  return parsePageImages(raw);
}

export async function getSiteVideos(): Promise<SiteVideos> {
  const raw = await getSetting("siteVideos");
  return parseSiteVideos(raw);
}
