import { cn, formatPrice } from "@/lib/utils";
import { storeHeadingSmClass } from "@/components/store/store-ui";
import { HIRE_POLICIES, OPENING_HOURS } from "@/lib/constants";
import { CalendarClock, Clock, Users } from "lucide-react";

type FittingAvailabilitySidebarProps = {
  className?: string;
};

/** Sidebar — schedule table + compact stat chips */
export function FittingAvailabilitySidebar({ className }: FittingAvailabilitySidebarProps) {
  return (
    <aside className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="bg-[#3d342e] px-5 py-4">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Clock className="size-4" />
            <h3 className={cn(storeHeadingSmClass, "text-base text-white")}>
              Studio hours
            </h3>
          </div>
        </div>
        <div className="divide-y divide-border">
          {OPENING_HOURS.map((h) => (
            <div
              key={h.days}
              className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
            >
              <span className="text-foreground/70">{h.days}</span>
              <span className="font-semibold text-foreground tabular-nums">{h.hours}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Users className="mx-auto mb-2 size-5 text-primary" />
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {HIRE_POLICIES.maxFittingGuests}
          </p>
          <p className="mt-1 text-xs text-foreground/65">guests max</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CalendarClock className="mx-auto mb-2 size-5 text-primary" />
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {HIRE_POLICIES.maxFittingDurationHours}h
          </p>
          <p className="mt-1 text-xs text-foreground/65">per session</p>
        </div>
      </div>

      <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-xs text-foreground/70">
        Reschedule fee {formatPrice(HIRE_POLICIES.rescheduleFee)} · Book 24h ahead
      </p>
    </aside>
  );
}
