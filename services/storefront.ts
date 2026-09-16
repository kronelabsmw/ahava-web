import { getSettings, type SiteSettings } from "@/services/settings";
import { getSiteContent, type SiteContentResult } from "@/services/site-content";
import { normalizeWhatsAppDigits } from "@/lib/whatsapp-utils";

export type StorefrontConfig = SiteSettings &
  SiteContentResult & {
    whatsappDigits: string;
  };

export async function getStorefrontConfig(): Promise<StorefrontConfig> {
  const [settings, siteContent] = await Promise.all([
    getSettings(),
    getSiteContent(),
  ]);

  return {
    ...settings,
    ...siteContent,
    whatsappDigits: normalizeWhatsAppDigits(settings.whatsapp),
  };
}
