import { prisma } from "@/lib/prisma";
import type { Promotion } from "@prisma/client";

export async function getActivePromotions(): Promise<Promotion[]> {
  try {
    return await prisma.promotion.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  try {
    return await prisma.promotion.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}
