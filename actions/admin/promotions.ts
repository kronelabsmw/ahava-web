"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import { optionalImageSrc } from "@/lib/product-schema";

const promotionSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(10),
  image: optionalImageSrc,
  discount: z.coerce.number().min(0).max(100).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  active: z.coerce.boolean().optional(),
});

function parseDate(value?: string | null) {
  if (!value?.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createPromotion(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = promotionSchema.parse({
      ...data,
      active: data.active === "on" || data.active === "true",
    });

    let slug = validated.slug?.trim() || slugify(validated.title);
    const existing = await prisma.promotion.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    await prisma.promotion.create({
      data: {
        title: validated.title.trim(),
        slug,
        description: validated.description.trim(),
        image: validated.image?.trim() || null,
        discount: validated.discount ?? null,
        startDate: parseDate(validated.startDate),
        endDate: parseDate(validated.endDate),
        active: validated.active ?? true,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/promotions");
    return { success: true };
  } catch (error) {
    console.error("Create promotion error:", error);
    return { success: false, error: "Failed to create promotion" };
  }
}

export async function updatePromotion(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = promotionSchema.parse({
      ...data,
      active: data.active === "on" || data.active === "true",
    });

    const existing = await prisma.promotion.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Promotion not found" };

    let slug = validated.slug?.trim() || existing.slug;
    if (slug !== existing.slug) {
      const conflict = await prisma.promotion.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    await prisma.promotion.update({
      where: { id },
      data: {
        title: validated.title.trim(),
        slug,
        description: validated.description.trim(),
        image: validated.image?.trim() || null,
        discount: validated.discount ?? null,
        startDate: parseDate(validated.startDate),
        endDate: parseDate(validated.endDate),
        active: validated.active ?? true,
      },
    });

    revalidatePath("/admin/promotions");
    revalidatePath("/promotions");
    return { success: true };
  } catch (error) {
    console.error("Update promotion error:", error);
    return { success: false, error: "Failed to update promotion" };
  }
}

export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({ where: { id } });
    revalidatePath("/admin/promotions");
    revalidatePath("/promotions");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete promotion" };
  }
}
