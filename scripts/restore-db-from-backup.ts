/**
 * Restore a JSON backup produced by backup-media-and-db.ts into the current DATABASE_URL.
 * Use this when moving to a new Vercel Postgres / Neon database.
 *
 * Usage:
 *   npx tsx scripts/restore-db-from-backup.ts backups/<timestamp>/db-export.json
 *
 * WARNING: upserts by primary key. Does not wipe tables first.
 * Prefer an empty target database (prisma db push) before restore.
 */
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import { loadProjectEnv } from "./env";

loadProjectEnv();

const prisma = new PrismaClient();

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error(
      "Usage: npx tsx scripts/restore-db-from-backup.ts backups/<stamp>/db-export.json"
    );
    process.exit(1);
  }

  const raw = await readFile(file, "utf8");
  const data = JSON.parse(raw) as Record<string, unknown[]>;

  console.log(`Restoring from ${file} (exported ${String((data as { exportedAt?: string }).exportedAt || "unknown")})`);

  // Order respects foreign keys
  const users = (data.users || []) as Array<Record<string, unknown>>;
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: String(user.id) },
      create: user as never,
      update: {
        email: user.email as string,
        name: user.name as string,
        password: user.password as string,
        role: user.role as never,
      },
    });
  }
  console.log(`  users: ${users.length}`);

  const brands = (data.brands || []) as Array<Record<string, unknown>>;
  for (const row of brands) {
    await prisma.brand.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: { name: row.name as string, slug: row.slug as string },
    });
  }
  console.log(`  brands: ${brands.length}`);

  // Categories may self-reference — insert parents first (null parentId), then children
  const categories = (data.categories || []) as Array<Record<string, unknown>>;
  const roots = categories.filter((c) => !c.parentId);
  const children = categories.filter((c) => c.parentId);
  for (const row of [...roots, ...children]) {
    await prisma.category.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: {
        name: row.name as string,
        slug: row.slug as string,
        description: (row.description as string | null) ?? null,
        image: (row.image as string | null) ?? null,
        parentId: (row.parentId as string | null) ?? null,
      },
    });
  }
  console.log(`  categories: ${categories.length}`);

  const products = (data.products || []) as Array<Record<string, unknown>>;
  for (const row of products) {
    await prisma.product.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  products: ${products.length}`);

  const productImages = (data.productImages || []) as Array<Record<string, unknown>>;
  for (const row of productImages) {
    await prisma.productImage.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: {
        url: row.url as string,
        alt: (row.alt as string | null) ?? null,
        order: Number(row.order ?? 0),
        productId: row.productId as string,
      },
    });
  }
  console.log(`  productImages: ${productImages.length}`);

  const productVariants = (data.productVariants || []) as Array<Record<string, unknown>>;
  for (const row of productVariants) {
    await prisma.productVariant.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  productVariants: ${productVariants.length}`);

  const promotions = (data.promotions || []) as Array<Record<string, unknown>>;
  for (const row of promotions) {
    await prisma.promotion.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  promotions: ${promotions.length}`);

  const eventPackages = (data.eventPackages || []) as Array<Record<string, unknown>>;
  for (const row of eventPackages) {
    await prisma.eventPackage.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  eventPackages: ${eventPackages.length}`);

  const inquiries = (data.inquiries || []) as Array<Record<string, unknown>>;
  for (const row of inquiries) {
    await prisma.inquiry.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  inquiries: ${inquiries.length}`);

  const dressBookings = (data.dressBookings || []) as Array<Record<string, unknown>>;
  for (const row of dressBookings) {
    await prisma.dressBooking.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  dressBookings: ${dressBookings.length}`);

  const customOrders = (data.customOrders || []) as Array<Record<string, unknown>>;
  for (const row of customOrders) {
    await prisma.customOrder.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  customOrders: ${customOrders.length}`);

  const eventBookings = (data.eventPackageBookings || []) as Array<
    Record<string, unknown>
  >;
  for (const row of eventBookings) {
    await prisma.eventPackageBooking.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  eventPackageBookings: ${eventBookings.length}`);

  const inventoryLogs = (data.inventoryLogs || []) as Array<Record<string, unknown>>;
  for (const row of inventoryLogs) {
    await prisma.inventoryLog.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  inventoryLogs: ${inventoryLogs.length}`);

  const settings = (data.settings || []) as Array<Record<string, unknown>>;
  for (const row of settings) {
    await prisma.setting.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: { key: row.key as string, value: row.value as string },
    });
  }
  console.log(`  settings: ${settings.length}`);

  const saleRecords = (data.saleRecords || []) as Array<Record<string, unknown>>;
  for (const row of saleRecords) {
    await prisma.saleRecord.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  saleRecords: ${saleRecords.length}`);

  const paymentEntries = (data.paymentEntries || []) as Array<Record<string, unknown>>;
  for (const row of paymentEntries) {
    await prisma.paymentEntry.upsert({
      where: { id: String(row.id) },
      create: row as never,
      update: row as never,
    });
  }
  console.log(`  paymentEntries: ${paymentEntries.length}`);

  console.log("\nRestore complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
