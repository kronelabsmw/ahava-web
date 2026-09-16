import Image from "next/image";
import Link from "next/link";
import {
  APP_NAME,
  LOGO_COMPACT_PATH,
  LOGO_PATH,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** Full lockup (light backgrounds) or compact transparent mark */
  variant?: "full" | "compact";
  /** White logo treatment for dark backgrounds — always uses the transparent compact asset */
  onDark?: boolean;
  /** Show AHAVAH wordmark below the mark (hero, footer) */
  showWordmark?: boolean;
  /** Semantic element for the wordmark when shown */
  wordmarkAs?: "h1" | "p" | "span";
  className?: string;
  imageClassName?: string;
  wordmarkClassName?: string;
  href?: string | null;
  priority?: boolean;
  onClick?: () => void;
};

const variantConfig = {
  full: {
    src: LOGO_PATH,
    width: 280,
    height: 112,
    defaultClass: "h-20 w-auto max-w-[280px] md:h-24",
  },
  compact: {
    src: LOGO_COMPACT_PATH,
    width: 160,
    height: 56,
    defaultClass: "h-10 w-auto max-w-[160px] sm:h-11",
  },
} as const;

export function BrandLogo({
  variant = "compact",
  onDark = false,
  showWordmark = false,
  className,
  imageClassName,
  wordmarkClassName,
  wordmarkAs = "span",
  href = "/",
  priority,
  onClick,
}: BrandLogoProps) {
  const config = variantConfig[variant];
  // Full PNG has a baked-in white box — on dark surfaces use the transparent compact mark.
  const imageConfig = onDark ? variantConfig.compact : config;

  const Wordmark = wordmarkAs;

  const content = (
    <>
      <Image
        src={imageConfig.src}
        alt={APP_NAME}
        width={imageConfig.width}
        height={imageConfig.height}
        priority={priority}
        className={cn(
          imageConfig.defaultClass,
          "object-contain",
          showWordmark || onDark ? "object-center" : "object-left",
          onDark && "brightness-0 invert",
          imageClassName
        )}
      />
      {showWordmark && (
        <Wordmark
          className={cn(
            "font-semibold tracking-[0.18em]",
            wordmarkClassName
          )}
        >
          {APP_NAME}
        </Wordmark>
      )}
    </>
  );

  const wrapperClass = cn(
    "inline-flex shrink-0",
    showWordmark ? "flex-col items-center" : "items-center",
    className
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
