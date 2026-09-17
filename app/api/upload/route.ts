import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { bufferToInlineDataUrl } from "@/lib/inline-image";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/upload-media";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function inferContentType(filename: string, headerType: string | null) {
  const normalized =
    headerType?.split(";")[0]?.trim().toLowerCase() || "application/octet-stream";

  if (normalized !== "application/octet-stream") {
    return normalized;
  }

  const ext = filename.toLowerCase().split(".").pop();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
  };

  return map[ext || ""] || normalized;
}

function isAllowedType(contentType: string, kind: "image" | "video") {
  if (kind === "image") {
    return IMAGE_TYPES.has(contentType);
  }
  return VIDEO_TYPES.has(contentType);
}

function sanitizeFilename(filename: string) {
  const base = filename.split(/[\\/]/).pop() || "upload";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned || "upload";
}

function uploadErrorResponse(error: unknown, kind: "image" | "video") {
  const text = error instanceof Error ? error.message : String(error);
  const lower = text.toLowerCase();

  if (kind === "video" && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Video uploads need Vercel Blob. Paste a video URL instead, or ask your administrator to enable Blob storage.",
      },
      { status: 503 }
    );
  }

  if (
    kind === "video" &&
    (lower.includes("blob_read_write_token") ||
      lower.includes("no token") ||
      lower.includes("unauthorized") ||
      lower.includes("access denied"))
  ) {
    return NextResponse.json(
      {
        error:
          "Video storage is not configured correctly. Paste a video URL instead for now.",
      },
      { status: 503 }
    );
  }

  if (lower.includes("too large") || lower.includes("size") || lower.includes("413")) {
    return NextResponse.json(
      { error: "That file is too large. Try a smaller image or video." },
      { status: 413 }
    );
  }

  if (lower.includes("content") || lower.includes("type") || lower.includes("unsupported")) {
    return NextResponse.json(
      {
        error:
          kind === "image"
            ? "That file type is not supported. Use JPG, PNG, WebP, or GIF."
            : "That file type is not supported. Use MP4, WebM, or MOV.",
      },
      { status: 400 }
    );
  }

  console.error("Upload failed:", error);

  return NextResponse.json(
    {
      error:
        kind === "image"
          ? "We couldn't process that image. Try again or use a smaller photo."
          : "We couldn't upload that video. Try again, use a smaller file, or paste a URL instead.",
    },
    { status: 500 }
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to the admin area before uploading files." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const kind = searchParams.get("kind") === "video" ? "video" : "image";

  if (!filename) {
    return NextResponse.json(
      { error: "No filename was provided for the upload." },
      { status: 400 }
    );
  }

  if (!request.body) {
    return NextResponse.json(
      { error: "No file was received. Please choose a file and try again." },
      { status: 400 }
    );
  }

  if (kind === "video" && !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Video uploads need Vercel Blob. Paste a video URL instead, or ask your administrator to enable Blob storage.",
      },
      { status: 503 }
    );
  }

  try {
    const buffer = Buffer.from(await request.arrayBuffer());
    const maxBytes = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

    if (buffer.byteLength === 0) {
      return NextResponse.json(
        { error: "The selected file is empty. Choose a different file." },
        { status: 400 }
      );
    }

    if (buffer.byteLength > maxBytes) {
      const mb = Math.round(maxBytes / (1024 * 1024));
      return NextResponse.json(
        {
          error: `That file is too large. Maximum size is ${mb} MB.`,
        },
        { status: 413 }
      );
    }

    const contentType = inferContentType(
      filename,
      request.headers.get("content-type")
    );

    if (!isAllowedType(contentType, kind)) {
      return NextResponse.json(
        {
          error:
            kind === "image"
              ? "That file type is not supported. Use JPG, PNG, WebP, or GIF."
              : "That file type is not supported. Use MP4, WebM, or MOV.",
        },
        { status: 400 }
      );
    }

    // Images → compressed base64 data URI (stored in Postgres, not Blob)
    if (kind === "image") {
      const { dataUrl } = await bufferToInlineDataUrl(buffer, contentType);
      return NextResponse.json({ url: dataUrl });
    }

    // Videos → Vercel Blob only
    const safeName = sanitizeFilename(filename);
    const pathname = `ahava/videos/${Date.now()}-${safeName}`;

    const blob = await put(pathname, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return uploadErrorResponse(error, kind);
  }
}
