import sharp from "sharp";
import {
  INLINE_IMAGE_MAX_EDGE,
  MAX_INLINE_IMAGE_BYTES,
  toDataUrl,
} from "@/lib/media";

/**
 * Resize + recompress an image buffer for storage as a data URI in Postgres.
 * Prefer JPEG unless the source is PNG with transparency or GIF.
 */
export async function bufferToInlineDataUrl(
  input: Buffer,
  sourceContentType?: string
): Promise<{ dataUrl: string; bytes: number; contentType: string }> {
  const meta = await sharp(input, { animated: false }).metadata();
  const hasAlpha = Boolean(meta.hasAlpha);
  const isGif =
    sourceContentType === "image/gif" || meta.format === "gif";

  let pipeline = sharp(input, { animated: false }).rotate().resize({
    width: INLINE_IMAGE_MAX_EDGE,
    height: INLINE_IMAGE_MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  let contentType: string;
  let encoded: Buffer;

  if (isGif) {
    // Store first frame as JPEG — animated GIFs are rare for products.
    encoded = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    contentType = "image/jpeg";
  } else if (hasAlpha) {
    encoded = await pipeline.webp({ quality: 80 }).toBuffer();
    contentType = "image/webp";
  } else {
    encoded = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    contentType = "image/jpeg";
  }

  if (encoded.byteLength > MAX_INLINE_IMAGE_BYTES) {
    // Second pass: smaller edge + stronger compression
    encoded = await sharp(encoded)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 70, mozjpeg: true })
      .toBuffer();
    contentType = "image/jpeg";
  }

  if (encoded.byteLength > MAX_INLINE_IMAGE_BYTES) {
    throw new Error(
      "Image is still too large after compression. Try a smaller photo."
    );
  }

  return {
    dataUrl: toDataUrl(contentType, encoded),
    bytes: encoded.byteLength,
    contentType,
  };
}

export async function fetchUrlToInlineDataUrl(
  url: string
): Promise<{ dataUrl: string; bytes: number; contentType: string } | null> {
  if (url.startsWith("data:image/")) {
    return null; // already inlined
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${url}`);
  }

  const contentType =
    response.headers.get("content-type")?.split(";")[0]?.trim() ||
    "image/jpeg";

  if (!contentType.startsWith("image/")) {
    throw new Error(`URL is not an image (${contentType}): ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return bufferToInlineDataUrl(Buffer.from(arrayBuffer), contentType);
}
