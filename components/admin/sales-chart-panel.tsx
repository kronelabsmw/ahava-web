import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { SalesChartPoint, SalesPeriod } from "@/lib/sales";
import { SALES_PERIODS } from "@/lib/sales";
import { AdminPanel } from "@/components/admin/admin-ui";
import { buttonVariants } from "@/components/ui/button";

const PERIOD_LABELS: Record<SalesPeriod, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const PERIOD_DESCRIPTIONS: Record<SalesPeriod, string> = {
  weekly: "Collected revenue over the last 8 weeks",
  monthly: "Collected revenue over the last 6 months",
  yearly: "Collected revenue over the last 5 years",
};

export function SalesChartPanel({
  data,
  period,
  basePath = "/admin/sales",
}: {
  data: SalesChartPoint[];
  period: SalesPeriod;
  basePath?: string;
}) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <AdminPanel
      title="Revenue collected"
      description={PERIOD_DESCRIPTIONS[period]}
      action={
        <div className="flex flex-wrap gap-1">
          {SALES_PERIODS.map((p) => (
            <Link
              key={p}
              href={`${basePath}?period=${p}`}
              className={cn(
                buttonVariants({
                  variant: p === period ? "default" : "outline",
                  size: "sm",
                }),
                "h-7 rounded-lg px-2.5 text-xs"
              )}
            >
              {PERIOD_LABELS[p]}
            </Link>
          ))}
        </div>
      }
    >
      <div className="flex h-48 items-end gap-2 sm:gap-3">
        {data.map((point) => (
          <div
            key={point.key}
            className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <span className="text-[10px] font-medium tabular-nums text-[#6B7B52] sm:text-xs">
              {point.revenue > 0 ? formatPrice(point.revenue) : "—"}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#6B7B52] to-[#8FA67A] transition-all"
                style={{
                  height: `${Math.max(6, (point.revenue / maxRevenue) * 100)}%`,
                  minHeight: point.revenue > 0 ? "0.75rem" : "0.25rem",
                }}
                title={`${point.label}: ${formatPrice(point.revenue)} (${point.count} payments)`}
              />
            </div>
            <span className="truncate text-[10px] text-[#8A9480] sm:text-xs">
              {point.label}
            </span>
          </div>
        ))}
      </div>
    </AdminPanel>
  );
}
