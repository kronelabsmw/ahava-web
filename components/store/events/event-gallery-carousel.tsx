"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type EventGalleryCarouselProps = {
  images: string[];
  className?: string;
};

export function EventGalleryCarousel({
  images,
  className,
}: EventGalleryCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToIndex = useCallback((next: number) => {
    const el = scrollerRef.current;
    if (!el || images.length === 0) return;
    const clamped = ((next % images.length) + images.length) % images.length;
    const child = el.children[clamped] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setIndex(clamped);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={() => {
          const el = scrollerRef.current;
          if (!el) return;
          const children = Array.from(el.children) as HTMLElement[];
          if (children.length === 0) return;
          const mid = el.scrollLeft + el.clientWidth / 2;
          let closest = 0;
          let best = Number.POSITIVE_INFINITY;
          children.forEach((child, i) => {
            const center = child.offsetLeft + child.offsetWidth / 2;
            const dist = Math.abs(center - mid);
            if (dist < best) {
              best = dist;
              closest = i;
            }
          });
          setIndex(closest);
        }}
        role="region"
        aria-label="Event photo gallery"
      >
        {images.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className="relative aspect-[4/3] w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-muted sm:w-[48%] lg:w-[32%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`AHAVA event photo ${i + 1}`}
              className="size-full object-cover"
              loading={i < 3 ? "eager" : "lazy"}
            />
          </figure>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs tabular-nums text-muted-foreground">
            {index + 1} / {images.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(index - 1)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(index + 1)}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Next photo"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
