"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaImage } from "@/components/media-image";
import {
  adminInputClass,
  adminOutlineButtonClass,
} from "@/components/admin/admin-form";
import { uploadImageFile } from "@/lib/upload-media";
import { Loader2, Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MultiImageFieldProps = {
  label?: string;
  description?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
};

export function MultiImageField({
  label,
  description,
  value,
  onChange,
  maxImages = 12,
  className,
}: MultiImageFieldProps) {
  const uploadInputId = useId();
  const [newUrl, setNewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function addUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      setError("Please enter a valid image URL (starting with https://).");
      return;
    }
    if (value.length >= maxImages) {
      setError(`You can add up to ${maxImages} images. Remove one to add another.`);
      return;
    }
    onChange([...value, trimmed]);
    setNewUrl("");
    setError(null);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (value.length >= maxImages) {
      setError(`You can add up to ${maxImages} images. Remove one to add another.`);
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadImageFile(file);
      onChange([...value, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const atLimit = value.length >= maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {(label || description) && (
        <div>
          {label && (
            <p className="text-sm font-medium text-[#2D3328]">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-[#8A9480]">{description}</p>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-video overflow-hidden rounded-xl border border-[#E8EBE4] bg-[#EEF2E8]"
            >
              <MediaImage
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-[#FCEAEA] hover:text-[#9B3A3A]"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!atLimit && (
        <div className="space-y-3 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] p-4">
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
              Upload image
            </Button>
            <input
              id={uploadInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <span className="self-center text-xs font-medium text-[#A8B09E]">
              or paste a URL
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/hero.jpg"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl(newUrl);
                }
              }}
              className={adminInputClass}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addUrl(newUrl)}
              disabled={!newUrl.trim()}
              className={adminOutlineButtonClass}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      )}

      {atLimit && (
        <p className="text-xs text-[#8A9480]">
          Maximum {maxImages} images reached. Remove one to add another.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-[#E8C5C5] bg-[#FCEAEA] px-3 py-2 text-xs text-[#9B3A3A]">
          {error}
        </p>
      )}
    </div>
  );
}
