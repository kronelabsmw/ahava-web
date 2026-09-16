import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/categories", changeFrequency: "weekly", priority: 0.8 },
  { path: "/promotions", changeFrequency: "weekly", priority: 0.7 },
  { path: "/hire-process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/fittings", changeFrequency: "monthly", priority: 0.7 },
  { path: "/custom-orders", changeFrequency: "monthly", priority: 0.7 },
  { path: "/events", changeFrequency: "weekly", priority: 0.8 },
  { path: "/events/packages", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let products: { slug: string; updatedAt: Date }[] = [];
  let parentCategories: { slug: string; updatedAt: Date }[] = [];
  let packages: { slug: string; updatedAt: Date }[] = [];

  try {
    [products, parentCategories, packages] = await Promise.all([
      prisma.product.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { parentId: null },
        select: { slug: true, updatedAt: true },
      }),
      prisma.eventPackage.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch {
    // Sitemap still returns static routes if the DB is unavailable at build time.
  }

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = parentCategories.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: absoluteUrl(`/events/packages/${pkg.slug}`),
    lastModified: pkg.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...packageEntries,
  ];
}
