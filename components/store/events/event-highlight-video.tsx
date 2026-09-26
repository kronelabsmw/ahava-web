type EventHighlightVideoProps = {
  videoUrl?: string | null;
  posterUrl?: string | null;
  className?: string;
};

/** Featured event highlight reel — replaceable via Admin → Settings */
export function EventHighlightVideo({
  videoUrl,
  posterUrl,
  className = "",
}: EventHighlightVideoProps) {
  const src = videoUrl?.trim();
  if (!src) return null;

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
        <div className="relative aspect-video">
          <video
            src={src}
            poster={posterUrl?.trim() || undefined}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Event highlight reel
      </p>
    </div>
  );
}
