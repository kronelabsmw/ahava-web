import { cn } from "@/lib/utils";
import { storeHeadingXsClass } from "@/components/store/store-ui";

type EventServicesListProps = {
  services: string[];
  className?: string;
};

/** Services — editorial numbered list, not tinted chips */
export function EventServicesList({ services, className }: EventServicesListProps) {
  return (
    <ul className={cn("space-y-1", className)}>
      {services.map((service, index) => (
        <li
          key={service}
          className="flex gap-5 border-b border-border/60 py-4 last:border-0"
        >
          <span className="w-8 shrink-0 text-lg font-bold text-primary/40 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="pt-0.5 text-sm font-medium leading-relaxed text-foreground/85 text-pretty">
            {service}
          </span>
        </li>
      ))}
    </ul>
  );
}

export type EventPlanningStep = {
  step: string;
  title: string;
  description: string;
};

type EventPlanningStepsProps = {
  steps: EventPlanningStep[];
  className?: string;
};

/** Planning process — vertical timeline beside hero image */
export function EventPlanningSteps({ steps, className }: EventPlanningStepsProps) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {steps.map((item, index) => {
        const isLast = index === steps.length - 1;

        return (
          <li key={item.step} className="relative flex gap-5 pb-8 last:pb-0">
            {!isLast && (
              <div
                className="absolute left-[1.125rem] top-10 h-[calc(100%-1rem)] w-px bg-primary/30"
                aria-hidden
              />
            )}
            <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground tabular-nums">
              {item.step}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className={cn(storeHeadingXsClass, "text-balance")}>{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70 text-pretty">
                {item.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
