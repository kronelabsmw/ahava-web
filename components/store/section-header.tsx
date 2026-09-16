import { cn } from "@/lib/utils";
import {
  storeHeadingMdClass,
  storeTextMutedClass,
  storeAccentBarClass,
} from "./store-ui";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  showAccent?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  showAccent = true,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 md:mb-8",
        align === "center" && "mx-auto max-w-2xl text-center",
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
        {showAccent && align === "left" && (
          <span className={storeAccentBarClass} aria-hidden="true" />
        )}
        <div>
          <h2 className={storeHeadingMdClass}>{title}</h2>
          {description && (
            <p className={cn("mt-3", storeTextMutedClass)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
