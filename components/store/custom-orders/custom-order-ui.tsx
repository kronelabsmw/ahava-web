import { cn } from "@/lib/utils";
import { storeHeadingSmClass, storeHeadingXsClass } from "@/components/store/store-ui";
import type { LucideIcon } from "lucide-react";

export type CustomOrderStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type CustomOrderJourneyProps = {
  steps: CustomOrderStep[];
  className?: string;
};

/** Bespoke journey — alternating editorial rows */
export function CustomOrderJourney({ steps, className }: CustomOrderJourneyProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((item, index) => {
        const Icon = item.icon;
        const isEven = index % 2 === 0;

        return (
          <li
            key={item.step}
            className={cn(
              "flex gap-5 border-b border-border/60 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8",
              isEven ? "bg-card" : "bg-secondary/35"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-primary tabular-nums">
                {item.step}
              </span>
              <div className="flex size-12 items-center justify-center rounded-lg border border-primary/25 bg-background text-primary">
                <Icon className="size-5" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={cn(storeHeadingXsClass, "text-balance")}>{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75 text-pretty">
                {item.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

type CustomOrderSidebarProps = {
  requirements: string[];
  children: React.ReactNode;
  className?: string;
};

/** Sidebar — numbered brief + CTA slot */
export function CustomOrderSidebar({
  requirements,
  children,
  className,
}: CustomOrderSidebarProps) {
  return (
    <aside className={cn("sticky top-24 space-y-6", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-secondary/60 px-6 py-4">
          <h3 className={cn(storeHeadingSmClass, "text-base")}>
            What we need from you
          </h3>
        </div>
        <ol className="divide-y divide-border">
          {requirements.map((item, i) => (
            <li key={item} className="flex gap-4 px-6 py-4 text-sm leading-relaxed text-foreground/80">
              <span className="text-lg font-bold text-primary/50 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-pretty pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      </div>
      {children}
    </aside>
  );
}
