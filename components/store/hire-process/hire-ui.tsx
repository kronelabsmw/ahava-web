import { cn, formatPrice } from "@/lib/utils";
import { storeHeadingXsClass, storeStatValueClass } from "@/components/store/store-ui";

export type HireFlowStep = {
  step: string;
  title: string;
  description: string;
};

type HireFlowStepsProps = {
  steps: HireFlowStep[];
  className?: string;
};

/** Hire journey — left-accent strips, payment-focused */
export function HireFlowSteps({ steps, className }: HireFlowStepsProps) {
  return (
    <ol className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((item) => (
        <li key={item.step}>
          <article className="relative h-full overflow-hidden rounded-xl border border-border bg-card pl-5 pr-5 py-5 shadow-sm">
            <div
              className="absolute bottom-0 left-0 top-0 w-1 bg-primary"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase text-primary tabular-nums">
              Step {item.step}
            </p>
            <h3 className={cn(storeHeadingXsClass, "mt-2 text-balance")}>
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70 text-pretty">
              {item.description}
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}

type HireDepositCardsProps = {
  bookingDepositPercent: string;
  securityDeposit: number;
  className?: string;
};

/** Deposits — stat-forward card + rules list card */
export function HireDepositCards({
  bookingDepositPercent,
  securityDeposit,
  className,
}: HireDepositCardsProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase text-primary">Booking deposit</p>
        <p className={cn(storeStatValueClass, "mt-2 text-primary tabular-nums")}>
          {bookingDepositPercent}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75 text-pretty">
          Of the total hire fee, required to reserve your gown for your wedding date.
        </p>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase text-foreground/55">
            Security deposit
          </p>
          <p className={cn(storeStatValueClass, "mt-1 tabular-nums")}>
            {formatPrice(securityDeposit)}
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            Held against damages; fully refunded on return in good condition.
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8">
        <h3 className={cn(storeHeadingXsClass, "mb-5")}>Reservation rules</h3>
        <ol className="space-y-4">
          {[
            "Dress choice is final once booked — no changes after confirmation.",
            "Share your wedding date, location, and special requirements at booking.",
            "One booking per dress per weekend for pristine condition.",
          ].map((rule, i) => (
            <li key={rule} className="flex gap-4 text-sm leading-relaxed text-foreground/80">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary tabular-nums">
                {i + 1}
              </span>
              <span className="text-pretty pt-0.5">{rule}</span>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}

type LocationSchedule = {
  location: string;
  subtitle: string;
  pickupDays: number;
  returnDays: number;
};

type HireLocationCompareProps = {
  local: LocationSchedule;
  remote: LocationSchedule;
  className?: string;
};

/** Pickup/return — single comparison table, not twin cards */
export function HireLocationCompare({
  local,
  remote,
  className,
}: HireLocationCompareProps) {
  const rows = [
    { label: "Pickup", local: local.pickupDays, remote: remote.pickupDays },
    { label: "Return", local: local.returnDays, remote: remote.returnDays },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="grid border-b border-border sm:grid-cols-2">
        <div className="border-b border-border bg-primary px-6 py-5 text-primary-foreground sm:border-b-0 sm:border-r">
          <p className="text-xs font-semibold uppercase opacity-80">Local</p>
          <h3 className={cn(storeHeadingXsClass, "mt-1 text-white")}>
            {local.location}
          </h3>
          <p className="mt-1 text-sm opacity-85">{local.subtitle}</p>
        </div>
        <div className="bg-[#3d342e] px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase opacity-80">Destination</p>
          <h3 className={cn(storeHeadingXsClass, "mt-1 text-white")}>
            {remote.location}
          </h3>
          <p className="mt-1 text-sm opacity-85">{remote.subtitle}</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="grid sm:grid-cols-3">
            <div className="flex items-center bg-secondary/40 px-6 py-4 text-sm font-semibold text-foreground">
              {row.label}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4 sm:border-t-0 sm:border-r sm:justify-center">
              <span className="text-xs text-foreground/55 sm:hidden">Local</span>
              <span className={cn(storeStatValueClass, "text-primary tabular-nums")}>
                {row.local}
              </span>
              <span className="text-sm text-foreground/65">days</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border px-6 py-4 sm:border-t-0 sm:justify-center">
              <span className="text-xs text-foreground/55 sm:hidden">Destination</span>
              <span className={cn(storeStatValueClass, "tabular-nums")}>{row.remote}</span>
              <span className="text-sm text-foreground/65">days</span>
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-border bg-secondary/30 px-6 py-3 text-center text-xs text-foreground/60">
        Days counted before and after your wedding date
      </p>
    </div>
  );
}
