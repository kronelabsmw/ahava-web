import { cn } from "@/lib/utils";

type StoreContainerSize = "default" | "wide" | "narrow" | "content";

const sizeClasses: Record<StoreContainerSize, string> = {
  default: "max-w-6xl",
  wide: "max-w-7xl",
  narrow: "max-w-3xl",
  content: "max-w-4xl",
};

interface StoreContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: StoreContainerSize;
  as?: "div" | "section";
}

export function StoreContainer({
  children,
  className,
  size = "default",
  as: Tag = "div",
}: StoreContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 sm:px-10 lg:px-16",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** Shared horizontal padding + max-width for header/footer alignment */
export const storeShellClass =
  "mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-16";
