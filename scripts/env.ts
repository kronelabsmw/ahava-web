/**
 * Shared helpers for scripts that talk to the live DB / Blob store.
 * Loads .env.local then .env without printing secrets.
 */
import { existsSync, readFileSync } from "node:fs";
import { head } from "@vercel/blob";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

export function loadProjectEnv() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");
}

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || undefined;
}

/**
 * Download an image URL. Retries with Blob token auth when public fetch returns 403.
 */
export async function downloadBinary(
  url: string
): Promise<{ ok: true; buffer: Buffer; contentType?: string } | { ok: false; error: string }> {
  if (url.startsWith("/")) {
    return { ok: false, error: "Skipped site-relative path (not in blob)" };
  }

  try {
    const publicResponse = await fetch(url);
    if (publicResponse.ok) {
      const buffer = Buffer.from(await publicResponse.arrayBuffer());
      return {
        ok: true,
        buffer,
        contentType: publicResponse.headers.get("content-type") || undefined,
      };
    }

    if (publicResponse.status !== 403 && publicResponse.status !== 401) {
      return { ok: false, error: `HTTP ${publicResponse.status}` };
    }

    const token = blobToken();
    if (!token) {
      return {
        ok: false,
        error: `HTTP ${publicResponse.status} (no BLOB_READ_WRITE_TOKEN for authenticated download)`,
      };
    }

    // Try Authorization header on the same URL
    const authed = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (authed.ok) {
      const buffer = Buffer.from(await authed.arrayBuffer());
      return {
        ok: true,
        buffer,
        contentType: authed.headers.get("content-type") || undefined,
      };
    }

    // Resolve via Blob head API (works when URL is in this store)
    try {
      const meta = await head(url, { token });
      const downloadTarget = meta.downloadUrl || meta.url;
      const viaHead = await fetch(downloadTarget, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (viaHead.ok) {
        const buffer = Buffer.from(await viaHead.arrayBuffer());
        return {
          ok: true,
          buffer,
          contentType: meta.contentType || viaHead.headers.get("content-type") || undefined,
        };
      }
      return {
        ok: false,
        error: `HTTP ${publicResponse.status} public / ${authed.status} auth / ${viaHead.status} head`,
      };
    } catch (headError) {
      const msg =
        headError instanceof Error ? headError.message : String(headError);
      return {
        ok: false,
        error: `HTTP ${publicResponse.status}; blob head failed: ${msg}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
