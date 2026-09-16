import { cn } from "@/lib/utils";

export function ProductGrid({
  children,
  className,
  columns = "default",
}: {
  children: React.ReactNode;
  className?: string;
  columns?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10",
        columns === "compact"
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
