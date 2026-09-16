import { cn } from "@/lib/utils";
import { storeHeadingXsClass } from "@/components/store/store-ui";

export type FittingStep = {
  step: string;
  title: string;
  description: string;
};

type FittingBookingFlowProps = {
  steps: FittingStep[];
  className?: string;
};

/** Appointment booking — connected circles, no boxed cards */
export function FittingBookingFlow({ steps, className }: FittingBookingFlowProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block"
        aria-hidden
      />

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6">
        {steps.map((item, index) => (
          <li
            key={item.step}
            className="relative flex gap-4 sm:flex-col sm:items-center sm:gap-0 sm:text-center lg:items-start lg:text-left"
          >
            <div className="flex flex-col items-center self-stretch sm:self-auto">
              <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-card text-lg font-bold text-primary shadow-sm sm:mb-4">
                {item.step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className="mt-3 w-px flex-1 bg-border sm:hidden"
                  aria-hidden
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1 sm:flex-none sm:pt-0">
              <h3 className={cn(storeHeadingXsClass, "text-balance")}>{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70 text-pretty">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

type FittingChecklistProps = {
  items: string[];
  className?: string;
};

/** Checklist — open grid, no panel wrapper */
export function FittingChecklist({ items, className }: FittingChecklistProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-primary/30 bg-secondary/30 p-6 sm:p-8",
        className
      )}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 text-sm text-foreground/85 shadow-sm"
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              aria-hidden
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
