"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { parseSiteContent } from "@/lib/site-content";

const REVALIDATE_PATHS = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/fittings",
  "/custom-orders",
  "/hire-process",
  "/admin/site-content",
];

export async function updateSiteContent(formData: FormData) {
  try {
    const raw = formData.get("siteContent") as string;
    const parsed = parseSiteContent(raw);

    await prisma.setting.upsert({
      where: { key: "siteContent" },
      update: { value: JSON.stringify(parsed) },
      create: { key: "siteContent", value: JSON.stringify(parsed) },
    });

    for (const path of REVALIDATE_PATHS) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to update site content:", error);
    return { success: false, error: "Failed to update site content" };
  }
}
