type BackgroundMediaProps = {
  videoUrl?: string | null;
  imageUrl?: string | null;
  alt?: string;
  className?: string;
  overlayClassName?: string;
  priority?: boolean;
};

/** Full-bleed background - video when set, otherwise image */
export function BackgroundMedia({
  videoUrl,
  imageUrl,
  alt = "",
  className = "absolute inset-0",
  overlayClassName,
}: BackgroundMediaProps) {
  const hasVideo = Boolean(videoUrl?.trim());
  const hasImage = Boolean(imageUrl?.trim());

  return (
    <>
      <div className={className}>
        {hasVideo ? (
          <video
            src={videoUrl!}
            poster={hasImage ? imageUrl! : undefined}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl!} alt={alt} className="h-full w-full object-cover" />
        ) : null}
      </div>
      {overlayClassName ? <div className={overlayClassName} aria-hidden /> : null}
    </>
  );
}
