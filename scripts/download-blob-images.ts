/**
 * Download every object under ahava/images/ from the linked Vercel Blob store
 * using BLOB_READ_WRITE_TOKEN (works even when public URLs return 403).
 *
 * Usage:
 *   npx tsx scripts/download-blob-images.ts
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { list } from "@vercel/blob";
import { downloadBinary, loadProjectEnv } from "./env";

loadProjectEnv();

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing in .env.local / .env");
  }

  const outRoot = path.join(process.cwd(), "backups", `blob-images-${stamp()}`);
  await mkdir(outRoot, { recursive: true });

  console.log("Listing ahava/images/ from Vercel Blob…");

  let cursor: string | undefined;
  let total = 0;
  let ok = 0;
  const manifest: Array<Record<string, unknown>> = [];

  do {
    const page = await list({
      prefix: "ahava/images/",
      cursor,
      limit: 100,
      token,
    });

    for (const blob of page.blobs) {
      total += 1;
      const hash = createHash("sha1").update(blob.url).digest("hex").slice(0, 8);
      const base =
        path.basename(blob.pathname).replace(/[^a-zA-Z0-9._-]/g, "-") ||
        "image";
      const file = `${String(total).padStart(3, "0")}-${hash}-${base}`;
      const dest = path.join(outRoot, file);

      process.stdout.write(`  [${total}] ${blob.pathname}… `);
      const result = await downloadBinary(blob.downloadUrl || blob.url);
      if (!result.ok) {
        console.log(`FAIL: ${result.error}`);
        manifest.push({
          pathname: blob.pathname,
          url: blob.url,
          ok: false,
          error: result.error,
        });
        continue;
      }
      await writeFile(dest, result.buffer);
      console.log(`ok (${result.buffer.byteLength} bytes)`);
      ok += 1;
      manifest.push({
        pathname: blob.pathname,
        url: blob.url,
        file,
        bytes: result.buffer.byteLength,
        ok: true,
      });
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  await writeFile(
    path.join(outRoot, "manifest.json"),
    JSON.stringify({ total, ok, failed: total - ok, items: manifest }, null, 2),
    "utf8"
  );

  console.log(`\nDone. ${ok}/${total} images saved to ${outRoot}`);
  if (ok === 0 && total === 0) {
    console.log(
      "No blobs under ahava/images/. The token may point at a different/empty store than the URLs in the database."
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
