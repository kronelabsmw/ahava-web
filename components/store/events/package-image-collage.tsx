import { cn } from "@/lib/utils";

type PackageImageCollageProps = {
  images: string[];
  name: string;
  fallbackClassName?: string;
  className?: string;
  /** Larger aspect for detail pages */
  size?: "card" | "detail";
};

/** Up to 3 package photos in a clean, consistent header collage */
export function PackageImageCollage({
  images,
  name,
  fallbackClassName,
  className,
  size = "card",
}: PackageImageCollageProps) {
  const photos = images.filter(Boolean).slice(0, 3);
  const aspect = size === "detail" ? "aspect-[2/1] sm:aspect-[21/9]" : "aspect-[16/10]";

  if (photos.length === 0) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-muted", aspect, className)}>
        <div
          className={cn(
            "flex size-full items-center justify-center bg-gradient-to-br",
            fallbackClassName
          )}
        >
          <span className="text-2xl font-semibold text-foreground/20 opacity-40">
            {name.charAt(0)}
          </span>
        </div>
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-muted", aspect, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt={name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  if (photos.length === 2) {
    return (
      <div className={cn("grid grid-cols-2 gap-1 overflow-hidden rounded-xl", aspect, className)}>
        {photos.map((src, i) => (
          <div key={`${src}-${i}`} className="relative min-h-0 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${name} photo ${i + 1}`}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-3 grid-rows-2 gap-1 overflow-hidden rounded-xl",
        aspect,
        className
      )}
    >
      <div className="relative col-span-2 row-span-2 min-h-0 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt={`${name} photo 1`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      {photos.slice(1).map((src, i) => (
        <div key={`${src}-${i}`} className="relative min-h-0 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${name} photo ${i + 2}`}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ))}
    </div>
  );
}

/** Resolve package display images from images[] with legacy image fallback */
export function resolvePackageImages(
  images?: string[] | null,
  legacyImage?: string | null
): string[] {
  const fromArray = (images ?? []).filter((url) => typeof url === "string" && url.trim());
  if (fromArray.length > 0) return fromArray.slice(0, 3);
  if (legacyImage?.trim()) return [legacyImage.trim()];
  return [];
}
