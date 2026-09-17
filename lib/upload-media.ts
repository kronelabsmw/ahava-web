/** Max upload size for images (10 MB) */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

/** Max upload size for short product / hero videos (50 MB) */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export const VIDEO_ACCEPT =
  "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

type UploadKind = "image" | "video";

type UploadOptions = {
  maxBytes?: number;
  kind?: UploadKind;
};

function formatUploadError(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "error" in data) {
    const message = (data as { error?: unknown }).error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
}

export async function uploadMediaFile(
  file: File,
  options?: UploadOptions
): Promise<string> {
  const kind = options?.kind ?? "image";
  const maxBytes =
    options?.maxBytes ??
    (kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES);

  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    throw new Error(`That file is too large. Maximum size is ${mb} MB.`);
  }

  if (kind === "image" && file.type && !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, or WebP).");
  }

  if (kind === "video" && file.type && !file.type.startsWith("video/")) {
    throw new Error("Please choose a video file (MP4, WebM, or MOV).");
  }

  if (
    kind === "video" &&
    !file.type &&
    !/\.(mp4|webm|mov|m4v)$/i.test(file.name)
  ) {
    throw new Error("Please choose a video file (MP4, WebM, or MOV).");
  }

  const params = new URLSearchParams({
    filename: file.name,
    kind,
  });

  const response = await fetch(`/api/upload?${params.toString()}`, {
    method: "POST",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      formatUploadError(
        data,
        "We couldn't upload that file. Try a smaller file or paste a URL instead."
      )
    );
  }

  if (
    typeof data.url !== "string" ||
    !data.url ||
    (!data.url.startsWith("http") && !data.url.startsWith("data:"))
  ) {
    throw new Error("Upload succeeded but no file URL was returned. Please try again.");
  }

  return data.url;
}

export function uploadImageFile(file: File, maxBytes = MAX_IMAGE_BYTES) {
  return uploadMediaFile(file, { kind: "image", maxBytes });
}

export function uploadVideoFile(file: File, maxBytes = MAX_VIDEO_BYTES) {
  return uploadMediaFile(file, { kind: "video", maxBytes });
}
