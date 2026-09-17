/** Max decoded size we keep after compressing images for DB storage (~1.5 MB). */
export const MAX_INLINE_IMAGE_BYTES = 1.5 * 1024 * 1024;

/** Longest edge after resize before encoding as JPEG/WebP. */
export const INLINE_IMAGE_MAX_EDGE = 1600;

export function isDataUrl(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith("data:"));
}

export function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://");
}

/** True for https URLs or data:image/... base64 URIs. */
export function isImageSrc(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  if (isDataUrl(value)) {
    return /^data:image\/[a-zA-Z0-9.+-]+;base64,/i.test(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return value.startsWith("/");
  }
}

/** Social / OG tags cannot use data URIs — fall back to site default. */
export function publicShareImageUrl(
  src: string | null | undefined,
  fallback: string
): string {
  if (!src || isDataUrl(src)) return fallback;
  return src;
}

export function toDataUrl(contentType: string, buffer: Buffer): string {
  const mime = contentType.split(";")[0]?.trim() || "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}
