"use client";

import Image, { type ImageProps } from "next/image";
import { isDataUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type MediaImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Renders next/image for remote URLs and a plain <img> for data URIs
 * (base64 images stored in Postgres cannot go through the optimizer).
 */
export function MediaImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  style,
  onClick,
  ...rest
}: MediaImageProps) {
  if (isDataUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", className)}
        style={style}
        onClick={onClick}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      style={style}
      onClick={onClick}
      {...rest}
    />
  );
}
