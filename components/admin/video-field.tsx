"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminInputClass,
  adminOutlineButtonClass,
} from "@/components/admin/admin-form";
import {
  MAX_VIDEO_BYTES,
  VIDEO_ACCEPT,
  uploadMediaFile,
} from "@/lib/upload-media";
import { Loader2, Upload, Video as VideoIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoFieldProps = {
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  posterUrl?: string;
  maxSizeMb?: number;
  className?: string;
};

function isVideoFile(file: File) {
  if (file.type.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|m4v)$/i.test(file.name);
}

export function VideoField({
  label,
  description,
  value,
  onChange,
  posterUrl,
  maxSizeMb = 50,
  className,
}: VideoFieldProps) {
  const uploadInputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isVideoFile(file)) {
      setError("Please select a video file (MP4, WebM, or MOV).");
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadMediaFile(file, {
        kind: "video",
        maxBytes: maxSizeMb * 1024 * 1024,
      });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm font-medium text-[#2D3328]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[#8A9480]">{description}</p>
        )}
        <p className="mt-1 text-xs text-[#A8B09E]">
          MP4, WebM, or MOV · max {maxSizeMb} MB · keep clips under ~30 seconds
        </p>
      </div>

      {value ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-[#E8EBE4] bg-black">
          <video
            src={value}
            poster={posterUrl || undefined}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-contain"
          />
          <button
            type="button"
            onClick={() => {
              setError(null);
              onChange("");
            }}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-[#FCEAEA] hover:text-[#9B3A3A]"
            aria-label="Remove video"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-[#D8DDD2] bg-[#FAFBF9]">
          <VideoIcon className="h-10 w-10 text-[#C5CCBC]" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          className={adminOutlineButtonClass}
          onClick={() => document.getElementById(uploadInputId)?.click()}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload video
        </Button>
        <input
          id={uploadInputId}
          type="file"
          accept={VIDEO_ACCEPT}
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <Input
          placeholder="Or paste video URL"
          value={value}
          onChange={(e) => {
            setError(null);
            onChange(e.target.value);
          }}
          className={cn(adminInputClass, "min-w-[200px] flex-1")}
        />
      </div>
      {error && (
        <p className="rounded-lg border border-[#E8C5C5] bg-[#FCEAEA] px-3 py-2 text-xs text-[#9B3A3A]">
          {error}
        </p>
      )}
    </div>
  );
}

export { MAX_VIDEO_BYTES, VIDEO_ACCEPT };
