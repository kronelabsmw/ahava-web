"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";
import { storeCardClass, storeCardHoverClass, storeTextMutedClass } from "@/components/store/store-ui";

type GalleryImage = {
  id: string;
  url: string;
  alt?: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  productName: string;
  videoUrl?: string | null;
};

export function ProductGallery({
  images,
  productName,
  videoUrl,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const hasImages = images.length > 0;
  const hasVideo = Boolean(videoUrl);
  const totalSlides = images.length + (hasVideo ? 1 : 0);

  const isVideoActive = hasVideo && activeIndex === images.length;
  const activeImage = hasImages ? images[activeIndex] : null;

  const goTo = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;
      const next = ((index % totalSlides) + totalSlides) % totalSlides;
      setActiveIndex(next);
      setShowVideo(hasVideo && next === images.length);
    },
    [totalSlides, hasVideo, images.length]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxOpen, goPrev, goNext]);

  if (!hasImages && !hasVideo) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-muted/40 text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
        {/* Thumbnails - horizontal on mobile, vertical strip on desktop */}
        {totalSlides > 1 && (
          <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:w-[72px] lg:shrink-0 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  setShowVideo(false);
                }}
                className={cn(
                  "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all lg:h-[88px] lg:w-full",
                  activeIndex === i && !showVideo
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border opacity-80 hover:border-primary/50 hover:opacity-100"
                )}
                aria-label={`View image ${i + 1}`}
                aria-current={activeIndex === i && !showVideo ? "true" : undefined}
              >
                <MediaImage
                  src={img.url}
                  alt={img.alt || `${productName} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
            {hasVideo && (
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(images.length);
                  setShowVideo(true);
                }}
                className={cn(
                  "relative flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-muted/60 transition-all lg:h-[88px] lg:w-full",
                  showVideo
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border opacity-80 hover:border-primary/50 hover:opacity-100"
                )}
                aria-label="View product video"
              >
                <Play className="h-5 w-5 text-foreground/70" />
              </button>
            )}
          </div>
        )}

        {/* Main viewer */}
        <div className="relative order-1 min-w-0 flex-1 lg:order-2">
          <div className={cn(storeCardClass, storeCardHoverClass, "group relative aspect-[3/4] overflow-hidden")}>
            {isVideoActive && videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="h-full w-full object-contain bg-black"
                playsInline
              />
            ) : activeImage ? (
              <MediaImage
                src={activeImage.url}
                alt={activeImage.alt || productName}
                fill
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            ) : null}

            {totalSlides > 1 && !isVideoActive && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {!isVideoActive && activeImage && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-md opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                aria-label="View full size"
              >
                <Expand className="h-3.5 w-3.5" />
                Enlarge
              </button>
            )}

            {totalSlides > 1 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium tabular-nums shadow-sm">
                {activeIndex + 1} / {totalSlides}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} gallery`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative h-full max-h-[90vh] w-full max-w-5xl">
            <MediaImage
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {activeIndex + 1} of {images.length}
          </p>
        </div>
      )}
    </>
  );
}
