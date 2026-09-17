/**
 * Download every remote image URL stored in the DB, convert to compressed
 * base64 data URIs, and write them back so Blob is only needed for videos.
 *
 * Usage:
 *   npx tsx scripts/inline-images-to-db.ts
 *   npx tsx scripts/inline-images-to-db.ts --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { bufferToInlineDataUrl } from "../lib/inline-image";
import { downloadBinary, loadProjectEnv } from "./env";

loadProjectEnv();

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function inlineIfRemote(url: string | null | undefined): Promise<string | null> {
  if (!url?.trim()) return url ?? null;
  if (url.startsWith("data:image/")) return url;
  if (url.startsWith("/")) return url; // keep local public paths

  const downloaded = await downloadBinary(url);
  if (!downloaded.ok) {
    throw new Error(downloaded.error);
  }

  const result = await bufferToInlineDataUrl(
    downloaded.buffer,
    downloaded.contentType
  );
  return result.dataUrl;
}

async function main() {
  console.log(dryRun ? "DRY RUN — no writes\n" : "Inlining images into database…\n");

  // Product images
  const productImages = await prisma.productImage.findMany();
  console.log(`ProductImage: ${productImages.length}`);
  for (const row of productImages) {
    if (row.url.startsWith("data:") || row.url.startsWith("/")) {
      console.log(`  skip ${row.id}`);
      continue;
    }
    try {
      const next = await inlineIfRemote(row.url);
      if (!next || next === row.url) continue;
      console.log(
        `  ${row.id}: ${row.url.slice(0, 60)}… → data URI (${Math.round(next.length / 1024)} KB string)`
      );
      if (!dryRun) {
        await prisma.productImage.update({
          where: { id: row.id },
          data: { url: next },
        });
      }
    } catch (error) {
      console.error(`  FAIL ${row.id}:`, error);
    }
  }

  // Categories
  const categories = await prisma.category.findMany({
    where: { image: { not: null } },
  });
  console.log(`\nCategory: ${categories.length} with images`);
  for (const row of categories) {
    try {
      const next = await inlineIfRemote(row.image);
      if (!next || next === row.image) continue;
      console.log(`  ${row.slug}: inlined`);
      if (!dryRun) {
        await prisma.category.update({
          where: { id: row.id },
          data: { image: next },
        });
      }
    } catch (error) {
      console.error(`  FAIL ${row.id}:`, error);
    }
  }

  // Promotions
  const promotions = await prisma.promotion.findMany({
    where: { image: { not: null } },
  });
  console.log(`\nPromotion: ${promotions.length} with images`);
  for (const row of promotions) {
    try {
      const next = await inlineIfRemote(row.image);
      if (!next || next === row.image) continue;
      console.log(`  ${row.slug}: inlined`);
      if (!dryRun) {
        await prisma.promotion.update({
          where: { id: row.id },
          data: { image: next },
        });
      }
    } catch (error) {
      console.error(`  FAIL ${row.id}:`, error);
    }
  }

  // Event packages
  const packages = await prisma.eventPackage.findMany({
    where: { image: { not: null } },
  });
  console.log(`\nEventPackage: ${packages.length} with images`);
  for (const row of packages) {
    try {
      const next = await inlineIfRemote(row.image);
      if (!next || next === row.image) continue;
      console.log(`  ${row.slug}: inlined`);
      if (!dryRun) {
        await prisma.eventPackage.update({
          where: { id: row.id },
          data: { image: next },
        });
      }
    } catch (error) {
      console.error(`  FAIL ${row.id}:`, error);
    }
  }

  // Settings: heroImages + pageImages (leave siteVideos as blob URLs)
  const settings = await prisma.setting.findMany({
    where: { key: { in: ["heroImages", "pageImages"] } },
  });
  console.log(`\nSettings media keys: ${settings.length}`);
  for (const setting of settings) {
    try {
      if (setting.key === "heroImages") {
        const parsed = JSON.parse(setting.value) as unknown;
        if (!Array.isArray(parsed)) continue;
        const next: string[] = [];
        for (const item of parsed) {
          if (typeof item !== "string") continue;
          next.push((await inlineIfRemote(item)) || item);
        }
        console.log(`  heroImages: ${next.length} entries`);
        if (!dryRun) {
          await prisma.setting.update({
            where: { id: setting.id },
            data: { value: JSON.stringify(next) },
          });
        }
      }

      if (setting.key === "pageImages") {
        const parsed = JSON.parse(setting.value) as Record<string, unknown>;
        const next: Record<string, string> = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value !== "string") continue;
          next[key] = (await inlineIfRemote(value)) || value;
        }
        console.log(`  pageImages: ${Object.keys(next).length} keys`);
        if (!dryRun) {
          await prisma.setting.update({
            where: { id: setting.id },
            data: { value: JSON.stringify(next) },
          });
        }
      }
    } catch (error) {
      console.error(`  FAIL setting ${setting.key}:`, error);
    }
  }

  console.log(
    dryRun
      ? "\nDry run finished — re-run without --dry-run to write."
      : "\nDone. Images are now base64 data URIs in Postgres. Videos remain on Blob."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
