import { prisma } from "@/lib/prisma";
import type { EventPackage } from "@prisma/client";

function isCustomPackage(nameOrSlug: string) {
  const lower = nameOrSlug.toLowerCase();
  return lower.includes("custom") || lower.includes("bespoke");
}

function sortPackages(packages: EventPackage[]): EventPackage[] {
  return [...packages].sort((a, b) => {
    const aCustom = isCustomPackage(a.name) || isCustomPackage(a.slug);
    const bCustom = isCustomPackage(b.name) || isCustomPackage(b.slug);
    if (aCustom !== bCustom) return aCustom ? 1 : -1;
    return Number(a.price) - Number(b.price);
  });
}

export async function getActiveEventPackages(): Promise<EventPackage[]> {
  try {
    const packages = await prisma.eventPackage.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });
    return sortPackages(packages);
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
