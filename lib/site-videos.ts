export type SiteVideoKey = "homeHero" | "eventsHero";

export type SiteVideos = Record<SiteVideoKey, string>;

export const SITE_VIDEO_META: Record<
  SiteVideoKey,
  { label: string; description: string; path: string }
> = {
  homeHero: {
    label: "Homepage hero video",
    description:
      "Optional looping background for the homepage hero. Falls back to the slideshow images when empty.",
    path: "/",
  },
  eventsHero: {
    label: "Events page hero video",
    description:
      "Optional looping background for the Events page banner. Falls back to the events hero image when empty.",
    path: "/events",
  },
};

export const DEFAULT_SITE_VIDEOS: SiteVideos = {
  homeHero: "",
  eventsHero: "",
};

export function parseSiteVideos(raw: unknown): SiteVideos {
  const base = { ...DEFAULT_SITE_VIDEOS };
  if (!raw) return base;
  try {
    const parsed: Partial<SiteVideos> =
      typeof raw === "string"
        ? (JSON.parse(raw) as Partial<SiteVideos>)
        : (raw as Partial<SiteVideos>);
    if (typeof parsed === "object" && parsed !== null) {
      for (const key of Object.keys(SITE_VIDEO_META) as SiteVideoKey[]) {
        if (typeof parsed[key] === "string") {
          base[key] = parsed[key]!;
        }
      }
    }
  } catch {
    /* use defaults */
  }
  return base;
}

export function isVideoUrl(url: string) {
  if (!url) return false;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes("video");
}
