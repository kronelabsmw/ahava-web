"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const packageSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  guestCount: z.coerce.number().optional().nullable(),
  servicesIncluded: z.string().min(1),
  additionalCharges: z.string().optional().nullable(),
  image: z.string().url().optional().nullable().or(z.literal("")),
  active: z.coerce.boolean().optional(),
});

function parseServices(raw: string) {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createEventPackage(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = packageSchema.parse({
      ...data,
      active: data.active === "on" || data.active === "true",
    });

    let slug = validated.slug?.trim() || slugify(validated.name);
    const existing = await prisma.eventPackage.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    await prisma.eventPackage.create({
      data: {
        name: validated.name.trim(),
        slug,
        description: validated.description.trim(),
        price: validated.price,
        guestCount: validated.guestCount ?? null,
        servicesIncluded: parseServices(validated.servicesIncluded),
        additionalCharges: validated.additionalCharges?.trim() || null,
        image: validated.image?.trim() || null,
        active: validated.active ?? true,
      },
    });

    revalidatePath("/admin/event-packages");
    revalidatePath("/events");
    revalidatePath("/events/packages");
    return { success: true };
  } catch (error) {
    console.error("Create event package error:", error);
    return { success: false, error: "Failed to create event package" };
  }
}

export async function updateEventPackage(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = packageSchema.parse({
      ...data,
      active: data.active === "on" || data.active === "true",
    });

    const existing = await prisma.eventPackage.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Package not found" };

    let slug = validated.slug?.trim() || existing.slug;
    if (slug !== existing.slug) {
      const conflict = await prisma.eventPackage.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) slug = `${slug}-${Date.now()}`;
    }

    await prisma.eventPackage.update({
      where: { id },
      data: {
        name: validated.name.trim(),
        slug,
        description: validated.description.trim(),
        price: validated.price,
        guestCount: validated.guestCount ?? null,
        servicesIncluded: parseServices(validated.servicesIncluded),
        additionalCharges: validated.additionalCharges?.trim() || null,
        image: validated.image?.trim() || null,
        active: validated.active ?? true,
      },
    });

    revalidatePath("/admin/event-packages");
    revalidatePath("/events");
    revalidatePath("/events/packages");
    revalidatePath(`/events/packages/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Update event package error:", error);
    return { success: false, error: "Failed to update event package" };
  }
}

export async function deleteEventPackage(id: string) {
  try {
    await prisma.eventPackage.delete({ where: { id } });
    revalidatePath("/admin/event-packages");
    revalidatePath("/events");
    revalidatePath("/events/packages");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete package" };
  }
}
