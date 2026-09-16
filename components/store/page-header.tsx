import { cn } from "@/lib/utils";
import {
  storeHeadingLgClass,
  storeTextMutedClass,
  storeAccentBarClass,
} from "./store-ui";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  showAccent?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  showAccent = true,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-4xl",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      )}
      <div className={cn("flex gap-6", align === "center" && "flex-col items-center")}>
        {showAccent && align === "left" && (
          <span className={storeAccentBarClass} aria-hidden="true" />
        )}
        <div>
          <h1 className={storeHeadingLgClass}>{title}</h1>
          {description && (
            <p className={cn("mt-4", storeTextMutedClass)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
