import { prisma } from "@/lib/prisma";
import type { EventPackage } from "@prisma/client";

export async function getActiveEventPackages(): Promise<EventPackage[]> {
  try {
    return await prisma.eventPackage.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getEventPackageBySlug(slug: string): Promise<EventPackage | null> {
  try {
    return await prisma.eventPackage.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}
