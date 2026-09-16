import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE_CONTENT,
  parseSiteContent,
  type SiteContent,
} from "@/lib/site-content";

export type SiteContentResult = {
  siteContent: SiteContent;
};

const SITE_CONTENT_KEY = "siteContent";

export async function getSiteContent(): Promise<SiteContentResult> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SITE_CONTENT_KEY },
    });
    if (!setting?.value) {
      return { siteContent: DEFAULT_SITE_CONTENT };
    }
    return { siteContent: parseSiteContent(setting.value) };
  } catch {
    return { siteContent: DEFAULT_SITE_CONTENT };
  }
}
