/**
 * Backup Postgres data (JSON) and download every image URL to disk.
 *
 * Usage:
 *   npx tsx scripts/backup-media-and-db.ts
 *
 * Writes:
 *   backups/<timestamp>/db-export.json
 *   backups/<timestamp>/images/<safe-name>
 *   backups/<timestamp>/manifest.json
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { downloadBinary, loadProjectEnv } from "./env";

loadProjectEnv();

const prisma = new PrismaClient();

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function collectImageUrls(exportData: Record<string, unknown>): string[] {
  const urls = new Set<string>();

  const add = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return;
    if (value.startsWith("data:")) return; // already inline
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/")
    ) {
      urls.add(value);
    }
  };

  const productImages = exportData.productImages as
    | Array<{ url?: string }>
    | undefined;
  productImages?.forEach((row) => add(row.url));

  const categories = exportData.categories as Array<{ image?: string | null }> | undefined;
  categories?.forEach((row) => add(row.image));

  const promotions = exportData.promotions as Array<{ image?: string | null }> | undefined;
  promotions?.forEach((row) => add(row.image));

  const eventPackages = exportData.eventPackages as
    | Array<{ image?: string | null }>
    | undefined;
  eventPackages?.forEach((row) => add(row.image));

  const settings = exportData.settings as Array<{ key?: string; value?: string }> | undefined;
  for (const setting of settings || []) {
    if (!setting.value) continue;
    if (setting.key === "heroImages") {
      try {
        const parsed = JSON.parse(setting.value) as unknown;
        if (Array.isArray(parsed)) parsed.forEach(add);
      } catch {
        /* ignore */
      }
    }
    if (setting.key === "pageImages") {
      try {
        const parsed = JSON.parse(setting.value) as Record<string, unknown>;
        Object.values(parsed).forEach(add);
      } catch {
        /* ignore */
      }
    }
  }

  return [...urls];
}

function safeFilename(url: string, index: number): string {
  try {
    const parsed = new URL(url);
    const base =
      path.basename(parsed.pathname).replace(/[^a-zA-Z0-9._-]/g, "-") ||
      "image";
    const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
    return `${String(index).padStart(3, "0")}-${hash}-${base}`;
  } catch {
    return `${String(index).padStart(3, "0")}-local.jpg`;
  }
}

async function downloadImage(
  url: string,
  destPath: string
): Promise<{ ok: boolean; error?: string; bytes?: number }> {
  const result = await downloadBinary(url);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  await writeFile(destPath, result.buffer);
  return { ok: true, bytes: result.buffer.byteLength };
}

async function main() {
  const outRoot = path.join(process.cwd(), "backups", stamp());
  const imagesDir = path.join(outRoot, "images");
  await mkdir(imagesDir, { recursive: true });

  console.log("Exporting database tables…");

  const [
    users,
    categories,
    brands,
    products,
    productImages,
    productVariants,
    promotions,
    inquiries,
    dressBookings,
    eventPackages,
    customOrders,
    eventPackageBookings,
    inventoryLogs,
    settings,
    saleRecords,
    paymentEntries,
  ] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password intentionally omitted from backup JSON shared off-box
      },
    }),
    prisma.category.findMany(),
    prisma.brand.findMany(),
    prisma.product.findMany(),
    prisma.productImage.findMany(),
    prisma.productVariant.findMany(),
    prisma.promotion.findMany(),
    prisma.inquiry.findMany(),
    prisma.dressBooking.findMany(),
    prisma.eventPackage.findMany(),
    prisma.customOrder.findMany(),
    prisma.eventPackageBooking.findMany(),
    prisma.inventoryLog.findMany(),
    prisma.setting.findMany(),
    prisma.saleRecord.findMany(),
    prisma.paymentEntry.findMany(),
  ]);

  // Full dump including password hashes for restore — keep this file private
  const usersFull = await prisma.user.findMany();

  const exportData = {
    exportedAt: new Date().toISOString(),
    users: usersFull,
    usersPublic: users,
    categories,
    brands,
    products,
    productImages,
    productVariants,
    promotions,
    inquiries,
    dressBookings,
    eventPackages,
    customOrders,
    eventPackageBookings,
    inventoryLogs,
    settings,
    saleRecords,
    paymentEntries,
  };

  const dbPath = path.join(outRoot, "db-export.json");
  await writeFile(dbPath, JSON.stringify(exportData, null, 2), "utf8");
  console.log(`Wrote ${dbPath}`);

  const imageUrls = collectImageUrls(exportData);
  console.log(`Found ${imageUrls.length} image URL(s) to download…`);

  const manifest: Array<{
    url: string;
    file?: string;
    ok: boolean;
    bytes?: number;
    error?: string;
  }> = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const file = safeFilename(url, i);
    const dest = path.join(imagesDir, file);
    process.stdout.write(`  [${i + 1}/${imageUrls.length}] ${url.slice(0, 80)}… `);
    const result = await downloadImage(url, dest);
    if (result.ok) {
      console.log(`ok (${result.bytes} bytes)`);
      manifest.push({ url, file, ok: true, bytes: result.bytes });
    } else {
      console.log(`FAIL: ${result.error}`);
      manifest.push({ url, ok: false, error: result.error });
    }
  }

  const manifestPath = path.join(outRoot, "manifest.json");
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        exportedAt: exportData.exportedAt,
        imageCount: imageUrls.length,
        downloaded: manifest.filter((m) => m.ok).length,
        failed: manifest.filter((m) => !m.ok).length,
        items: manifest,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("\nBackup complete:");
  console.log(`  Folder: ${outRoot}`);
  console.log(`  DB JSON: ${dbPath}`);
  console.log(`  Images: ${imagesDir}`);
  console.log(`  Manifest: ${manifestPath}`);
  console.log(
    "\nNext: run  npx tsx scripts/inline-images-to-db.ts  to convert URLs → base64 in the database."
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
