import { prisma } from "@/lib/prisma";
import type { DressListingType, Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    category: { include: { parent: true } };
    brand: true;
  };
}>;

export type SerializableProduct = Omit<
  ProductWithRelations,
  "price" | "discountPrice" | "salePrice"
> & {
  price: number;
  discountPrice: number | null;
  salePrice: number | null;
};

export function serializeProduct(
  product: ProductWithRelations
): SerializableProduct {
  return {
    ...product,
    price: Number(product.price),
    discountPrice: product.discountPrice
      ? Number(product.discountPrice)
      : null,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  };
}

/** Strip Prisma Decimal fields before passing products to client components */
export function serializeAdminProduct<
  T extends {
    price: unknown;
    discountPrice?: unknown | null;
    salePrice?: unknown | null;
    depositPercent?: unknown | null;
  },
>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    discountPrice:
      product.discountPrice != null ? Number(product.discountPrice) : null,
    salePrice: product.salePrice != null ? Number(product.salePrice) : null,
    depositPercent:
      product.depositPercent != null ? Number(product.depositPercent) : null,
  };
}

const productInclude = {
  images: { orderBy: { order: "asc" as const } },
  variants: true,
  category: { include: { parent: true } },
  brand: true,
};

export async function getProducts(filters?: {
  category?: string;
  parentCategory?: string;
  search?: string;
  listingType?: DressListingType;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{
  products: SerializableProduct[];
  total: number;
  pages: number;
}> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { active: true };

    if (filters?.featured) where.featured = true;
    if (filters?.listingType) where.listingType = filters.listingType;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.category) {
      where.category = { slug: filters.category };
    }
    if (filters?.parentCategory) {
      where.category = { parent: { slug: filters.parentCategory } };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    switch (filters?.sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(serializeProduct),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch {
    return { products: [], total: 0, pages: 0 };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  try {
    return await prisma.product.findFirst({
      where: { slug, active: true },
      include: productInclude,
    });
  } catch {
    return null;
  }
}

export async function getFeaturedProducts(
  limit = 8
): Promise<SerializableProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: productInclude,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map(serializeProduct);
  } catch {
    return [];
  }
}

export async function getNewArrivals(
  limit = 4
): Promise<SerializableProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: productInclude,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    return products.map(serializeProduct);
  } catch {
    return [];
  }
}
