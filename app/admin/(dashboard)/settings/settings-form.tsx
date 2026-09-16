"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/image-field";
import { MultiImageField } from "@/components/admin/multi-image-field";
import { VideoField } from "@/components/admin/video-field";
import { updateSettings } from "@/actions/admin/settings";
import {
  PAGE_IMAGE_META,
  type PageImageKey,
  type PageImages,
} from "@/lib/page-images";
import {
  SITE_VIDEO_META,
  type SiteVideoKey,
  type SiteVideos,
} from "@/lib/site-videos";
import { Loader2, Store, Images, Film, LayoutTemplate } from "lucide-react";
import {
  AdminFormSection,
  AdminFormAlert,
  AdminFormActions,
  adminInputClass,
  adminTextareaClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-form";

type SettingsFormProps = {
  initialSettings: {
    shopName?: string;
    tagline?: string;
    whatsapp?: string;
    heroImages?: string[];
    pageImages?: PageImages;
    siteVideos?: SiteVideos;
  };
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [shopName, setShopName] = useState(initialSettings.shopName || "");
  const [tagline, setTagline] = useState(initialSettings.tagline || "");
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp || "");
  const [heroImages, setHeroImages] = useState<string[]>(
    initialSettings.heroImages || []
  );
  const [pageImages, setPageImages] = useState<PageImages>(
    initialSettings.pageImages || ({} as PageImages)
  );
  const [siteVideos, setSiteVideos] = useState<SiteVideos>(
    initialSettings.siteVideos || ({} as SiteVideos)
  );
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function updatePageImage(key: PageImageKey, url: string) {
    setPageImages((prev) => ({ ...prev, [key]: url }));
  }

  function updateSiteVideo(key: SiteVideoKey, url: string) {
    setSiteVideos((prev) => ({ ...prev, [key]: url }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("tagline", tagline);
      formData.append("whatsapp", whatsapp);
      formData.append("heroImages", JSON.stringify(heroImages));
      formData.append("pageImages", JSON.stringify(pageImages));
      formData.append("siteVideos", JSON.stringify(siteVideos));

      const result = await updateSettings(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Settings saved successfully." });
      } else {
        throw new Error(result.error || "Failed to save");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <AdminFormAlert
          variant={message.type === "success" ? "success" : "error"}
          className="mb-6"
        >
          {message.text}
        </AdminFormAlert>
      )}

      <div className="space-y-4">
        <AdminFormSection
          title="General information"
          description="Shop name, tagline, and contact details shown across the site."
          icon={Store}
        >
          <div className="space-y-2">
            <Label htmlFor="shopName" className="text-[#2D3328]">
              Shop name
            </Label>
            <Input
              id="shopName"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              className={adminInputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-[#2D3328]">
              Tagline
            </Label>
            <Textarea
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
              className={adminTextareaClass}
            />
            <p className="text-xs text-[#8A9480]">
              Shown on the homepage and about page.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-[#2D3328]">
              WhatsApp number
            </Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+265..."
              required
              className={adminInputClass}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Homepage hero slideshow"
          description="Images rotate on the homepage hero. Upload or paste URLs."
          icon={Images}
        >
          <MultiImageField
            value={heroImages}
            onChange={setHeroImages}
            maxImages={12}
          />
        </AdminFormSection>

        <AdminFormSection
          title="Homepage & events videos"
          description="Optional short looping videos for page backgrounds."
          icon={Film}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(SITE_VIDEO_META) as SiteVideoKey[]).map((key) => (
              <VideoField
                key={key}
                label={SITE_VIDEO_META[key].label}
                description={`${SITE_VIDEO_META[key].description} (${SITE_VIDEO_META[key].path})`}
                value={siteVideos[key] || ""}
                onChange={(url) => updateSiteVideo(key, url)}
                posterUrl={
                  key === "homeHero" ? heroImages[0] : pageImages.eventsHero
                }
              />
            ))}
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Page images"
          description="Manage banner and hero images across storefront pages."
          icon={LayoutTemplate}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(PAGE_IMAGE_META) as PageImageKey[]).map((key) => (
              <ImageField
                key={key}
                label={PAGE_IMAGE_META[key].label}
                description={`${PAGE_IMAGE_META[key].description} (${PAGE_IMAGE_META[key].path})`}
                value={pageImages[key] || ""}
                onChange={(url) => updatePageImage(key, url)}
              />
            ))}
          </div>
        </AdminFormSection>
      </div>

      <AdminFormActions>
        <Button
          type="submit"
          disabled={isPending}
          className={adminPrimaryButtonClass}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save settings
        </Button>
      </AdminFormActions>
    </form>
  );
}
