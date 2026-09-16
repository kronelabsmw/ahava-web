import { cn } from "@/lib/utils";
import {
  storeAccentBarClass,
  storeHeadingLgClass,
  storeTextMutedClass,
} from "@/components/store/store-ui";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PageIntroProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-3xl",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      )}
      <div className={cn("flex gap-4", align === "center" && "flex-col items-center")}>
        <span className={storeAccentBarClass} aria-hidden />
        <div>
          <h1 className={storeHeadingLgClass}>{title}</h1>
          {description && (
            <p className={cn("mt-4 leading-relaxed", storeTextMutedClass)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type PageBannerProps = {
  src: string;
  alt: string;
  className?: string;
  overlay?: "light" | "dark";
};

export function PageBanner({
  src,
  alt,
  className,
  overlay = "light",
}: PageBannerProps) {
  return (
    <div
      className={cn(
        "relative mb-12 overflow-hidden rounded-2xl border border-border md:mb-16",
        "aspect-[21/9] min-h-[220px] sm:min-h-[280px]",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div
        className={cn(
          "absolute inset-0",
          overlay === "light"
            ? "bg-gradient-to-r from-background/95 via-background/70 to-background/20"
            : "bg-gradient-to-t from-background via-background/60 to-transparent"
        )}
      />
    </div>
  );
}
