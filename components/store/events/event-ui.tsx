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
  imageUrl?: string;
};

type EventPlanningStepsProps = {
  steps: EventPlanningStep[];
  className?: string;
};

/** Planning process — each stage with its own image */
export function EventPlanningSteps({ steps, className }: EventPlanningStepsProps) {
  return (
    <ol className={cn("grid gap-6 sm:grid-cols-2", className)}>
      {steps.map((item) => (
        <li key={item.step}>
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-secondary/60">
                  <span className="text-3xl font-bold text-primary/25 tabular-nums">
                    {item.step}
                  </span>
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground tabular-nums">
                Step {item.step}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className={cn(storeHeadingXsClass, "text-balance")}>{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70 text-pretty">
                {item.description}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
