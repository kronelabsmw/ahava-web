"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { optionalImageSrc } from "@/lib/product-schema";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image: optionalImageSrc,
  parentId: z.string().optional().nullable().or(z.literal("none")),
});

function revalidateCategorySurfaces(slug?: string | null, parentSlug?: string | null) {
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/categories/${slug}`);
  if (parentSlug) revalidatePath(`/categories/${parentSlug}`);
}

export async function createCategory(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const validatedData = categorySchema.parse({
      ...data,
    });

    const parentId =
      validatedData.parentId === "none" ? null : validatedData.parentId || null;

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        parentId,
      },
      include: { parent: { select: { slug: true } } },
    });

    revalidateCategorySurfaces(category.slug, category.parent?.slug);

    return { success: true, categoryId: category.id };
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());

    const validatedData = categorySchema.parse({
      ...data,
    });

    const existing = await prisma.category.findUnique({
      where: { id },
      select: { slug: true, parent: { select: { slug: true } } },
    });

    const parentId =
      validatedData.parentId === "none" ? null : validatedData.parentId || null;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        parentId,
      },
      include: { parent: { select: { slug: true } } },
    });

    revalidateCategorySurfaces(category.slug, category.parent?.slug);
    if (existing?.slug && existing.slug !== category.slug) {
      revalidatePath(`/categories/${existing.slug}`);
    }
    if (existing?.parent?.slug && existing.parent.slug !== category.parent?.slug) {
      revalidatePath(`/categories/${existing.parent.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        slug: true,
        parent: { select: { slug: true } },
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }
    if (category._count.products > 0) {
      return {
        success: false,
        error: "Move or delete products in this category before deleting it.",
      };
    }
    if (category._count.children > 0) {
      return {
        success: false,
        error: "Delete or reassign subcategories before deleting this category.",
      };
    }

    await prisma.category.delete({ where: { id } });
    revalidateCategorySurfaces(category.slug, category.parent?.slug);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        "Failed to delete category. Make sure it has no products or subcategories.",
    };
  }
}
