import { prisma } from "@/lib/prisma";
import type { Category, Prisma } from "@prisma/client";

const activeProductCount = {
  products: { where: { active: true } },
} as const;

export type ParentCategory = Prisma.CategoryGetPayload<{
  include: {
    children: { include: { _count: { select: typeof activeProductCount } } };
    _count: { select: typeof activeProductCount };
  };
}>;

export type CategoryWithParent = Prisma.CategoryGetPayload<{
  include: {
    parent: true;
    children: { include: { _count: { select: typeof activeProductCount } } };
    _count: { select: typeof activeProductCount };
  };
}>;

export async function getParentCategories(): Promise<ParentCategory[]> {
  try {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: { _count: { select: activeProductCount } },
          orderBy: { name: "asc" },
        },
        _count: { select: activeProductCount },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithParent | null> {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          include: { _count: { select: activeProductCount } },
          orderBy: { name: "asc" },
        },
        _count: { select: activeProductCount },
      },
    });
  } catch {
    return null;
  }
}

export async function getAllCategories(): Promise<
  (Category & { parent: Category | null; _count: { products: number } })[]
> {
  try {
    return await prisma.category.findMany({
      include: {
        parent: true,
        _count: { select: activeProductCount },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}
