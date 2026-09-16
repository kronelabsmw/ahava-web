import { prisma } from "@/lib/prisma";
import { APP_NAME, APP_TAGLINE, WHATSAPP_FULL } from "@/lib/constants";
import {
  DEFAULT_PAGE_IMAGES,
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
  pageImages: PageImages;
  siteVideos: SiteVideos;
};

const DEFAULT_SETTINGS: SiteSettings = {
  shopName: APP_NAME,
  tagline: APP_TAGLINE,
  whatsapp: WHATSAPP_FULL,
  heroImages: [],
  pageImages: DEFAULT_PAGE_IMAGES,
  siteVideos: DEFAULT_SITE_VIDEOS,
};

/** Raw string defaults for DB seeding / getSetting fallback */
const defaults: Record<string, string> = {
  shopName: APP_NAME,
  tagline: APP_TAGLINE,
  whatsapp: WHATSAPP_FULL,
  heroImages: JSON.stringify([]),
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

export async function getSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, unknown> = { ...defaults };
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    if (typeof map.heroImages === "string") {
      try {
        map.heroImages = JSON.parse(map.heroImages);
      } catch {
        map.heroImages = [];
      }
    }

    map.pageImages = parsePageImages(map.pageImages);
    map.siteVideos = parseSiteVideos(map.siteVideos);

    return {
      shopName: String(map.shopName ?? DEFAULT_SETTINGS.shopName),
      tagline: String(map.tagline ?? DEFAULT_SETTINGS.tagline),
      whatsapp: String(map.whatsapp ?? DEFAULT_SETTINGS.whatsapp),
      heroImages: Array.isArray(map.heroImages)
        ? (map.heroImages as string[])
        : DEFAULT_SETTINGS.heroImages,
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

export async function getPageImages(): Promise<PageImages> {
  const raw = await getSetting("pageImages");
  return parsePageImages(raw);
}

export async function getSiteVideos(): Promise<SiteVideos> {
  const raw = await getSetting("siteVideos");
  return parseSiteVideos(raw);
}
