"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PAGE_IMAGE_META, parsePageImages } from "@/lib/page-images";
import { SITE_VIDEO_META, parseSiteVideos } from "@/lib/site-videos";

const REVALIDATE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/fittings",
  "/custom-orders",
  "/hire-process",
  "/admin/settings",
];

export async function updateSettings(formData: FormData) {
  try {
    const shopName = formData.get("shopName") as string;
    const tagline = formData.get("tagline") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const heroImages = formData.get("heroImages") as string;
    const pageImages = formData.get("pageImages") as string;
    const siteVideos = formData.get("siteVideos") as string;

    parsePageImages(pageImages);
    parseSiteVideos(siteVideos);

    const settings = [
      { key: "shopName", value: shopName },
      { key: "tagline", value: tagline },
      { key: "whatsapp", value: whatsapp },
      { key: "heroImages", value: heroImages },
      { key: "pageImages", value: pageImages },
      { key: "siteVideos", value: siteVideos },
    ];

    for (const setting of settings) {
      if (setting.value !== null && setting.value !== undefined) {
        await prisma.setting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        });
      }
    }

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }
    for (const key of Object.keys(PAGE_IMAGE_META)) {
      revalidatePath(PAGE_IMAGE_META[key as keyof typeof PAGE_IMAGE_META].path);
    }
    for (const key of Object.keys(SITE_VIDEO_META)) {
      revalidatePath(SITE_VIDEO_META[key as keyof typeof SITE_VIDEO_META].path);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
