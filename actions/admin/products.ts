"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  formatProductValidationError,
  parseAdminProductPayload,
  type AdminProductInput,
} from "@/lib/product-schema";
import { ZodError } from "zod";

async function resolveBrandId(brandName: string | null | undefined) {
  const trimmed = brandName?.trim();
  if (!trimmed) return null;

  const slug = slugify(trimmed);
  const brand = await prisma.brand.upsert({
    where: { slug },
    update: { name: trimmed },
    create: { name: trimmed, slug },
  });
  return brand.id;
}

function productWriteData(validated: AdminProductInput, brandId: string | null) {
  return {
    name: validated.name,
    slug: validated.slug,
    description: validated.description,
    price: validated.price,
    salePrice: validated.salePrice ?? null,
    discountPrice: validated.discountPrice ?? null,
    listingType: validated.listingType,
    condition: validated.condition ?? null,
    depositPercent: validated.depositPercent ?? 45,
    specialNotes: validated.specialNotes ?? null,
    stock: validated.stock,
    featured: validated.featured,
    active: validated.active,
    categoryId: validated.categoryId,
    brandId,
    tags: validated.tags,
    videoUrl: validated.videoUrl || null,
  };
}

function revalidateProductSurfaces(slug?: string | null) {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = parseAdminProductPayload(data);
    const brandId = await resolveBrandId(validated.brandName);

    const product = await prisma.product.create({
      data: {
        ...productWriteData(validated, brandId),
        images: {
          create: validated.images.map((url, index) => ({
            url,
            order: index,
          })),
        },
        variants: {
          create: validated.variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            sku: variant.sku ?? null,
          })),
        },
      },
    });

    revalidateProductSurfaces(product.slug);

    return { success: true, productId: product.id };
  } catch (error) {
    console.error("Create product error:", error);
    if (error instanceof ZodError) {
      return { success: false, error: formatProductValidationError(error) };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = parseAdminProductPayload(data);
    const brandId = await resolveBrandId(validated.brandName);

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productVariant.deleteMany({ where: { productId: id } }),
      prisma.product.update({
        where: { id },
        data: {
          ...productWriteData(validated, brandId),
          images: {
            create: validated.images.map((url, index) => ({
              url,
              order: index,
            })),
          },
          variants: {
            create: validated.variants.map((variant) => ({
              size: variant.size,
              color: variant.color,
              stock: variant.stock,
              sku: variant.sku ?? null,
            })),
          },
        },
      }),
    ]);

    revalidateProductSurfaces(validated.slug);
    if (existing?.slug && existing.slug !== validated.slug) {
      revalidatePath(`/products/${existing.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof ZodError) {
      return { success: false, error: formatProductValidationError(error) };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        slug: true,
        category: { select: { slug: true, parent: { select: { slug: true } } } },
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const bookingCount = await prisma.dressBooking.count({
      where: { productId: id },
    });
    if (bookingCount > 0) {
      return {
        success: false,
        error: `This product has ${bookingCount} booking(s). Deactivate it instead of deleting.`,
      };
    }

    await prisma.$transaction([
      prisma.inquiry.updateMany({
        where: { productId: id },
        data: { productId: null },
      }),
      prisma.product.delete({ where: { id } }),
    ]);

    revalidateProductSurfaces(product.slug);
    if (product.category.parent?.slug) {
      revalidatePath(`/categories/${product.category.parent.slug}`);
    }
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete product. It may still be linked to other records.",
    };
  }
}
