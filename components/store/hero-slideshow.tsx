"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundMedia } from "@/components/store/background-media";
import { BrandLogo } from "@/components/store/brand-logo";
import { storeHeadingLgClass } from "@/components/store/store-ui";
import { cn } from "@/lib/utils";

interface HeroSlideshowProps {
  images: string[];
  tagline: string;
  videoUrl?: string | null;
}

const fallbackGradients = [
  "from-rose-100 via-amber-50 to-stone-100",
  "from-stone-100 via-rose-50 to-amber-100",
  "from-amber-50 via-rose-100 to-stone-50",
];

export function HeroSlideshow({ images, tagline, videoUrl }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const hasVideo = Boolean(videoUrl?.trim());
  const slides = images.length > 0 ? images : fallbackGradients;
  const isGradient = !hasVideo && images.length === 0;
  const posterImage = images[0];

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
      {hasVideo ? (
        <BackgroundMedia
          videoUrl={videoUrl}
          imageUrl={posterImage}
          alt="AHAVAH bridal hero"
          overlayClassName="absolute inset-0 bg-black/40"
        />
      ) : isGradient ? (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slides[current] as string}`}
          />
          <div className="absolute inset-0 bg-black/35" />
        </>
      ) : (
        <>
          <Image
            src={slides[current] as string}
            alt="Bridal lookbook"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </>
      )}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">
          Malawi
        </p>
        <div className="mt-6 flex flex-col items-center">
          <BrandLogo
            variant="compact"
            onDark
            showWordmark
            wordmarkAs="h1"
            priority
            href="/"
            className="justify-center"
            imageClassName="h-20 w-auto md:h-24"
            wordmarkClassName={cn("mt-4 text-white", storeHeadingLgClass)}
          />
        </div>
        <p className="mt-4 max-w-xl text-lg text-white/90">{tagline}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/shop">Browse Dresses</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white/50 border-white text-white hover:bg-white/10"
          >
            <Link href="/fittings">Book a Fitting</Link>
          </Button>
        </div>
      </div>

      {!hasVideo && slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
