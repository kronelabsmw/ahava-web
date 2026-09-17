"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaImage } from "@/components/media-image";
import { adminInputClass, adminOutlineButtonClass } from "@/components/admin/admin-form";
import { uploadImageFile } from "@/lib/upload-media";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageFieldProps = {
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
  className?: string;
};

export function ImageField({
  label,
  description,
  value,
  onChange,
  aspectClass = "aspect-video",
  className,
}: ImageFieldProps) {
  const uploadInputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm font-medium text-[#2D3328]">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[#8A9480]">{description}</p>
        )}
      </div>

      {value ? (
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl border border-[#E8EBE4] bg-[#EEF2E8]",
            aspectClass
          )}
        >
          <MediaImage
            src={value}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-[#FCEAEA] hover:text-[#9B3A3A]"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl border border-dashed border-[#D8DDD2] bg-[#FAFBF9]",
            aspectClass
          )}
        >
          <ImageIcon className="h-8 w-8 text-[#C5CCBC]" />
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
          Upload
        </Button>
        <input
          id={uploadInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <Input
          placeholder="Or paste image URL"
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
