import Link from "next/link";
import {
  cn,
  formatAdminDate,
  formatAdminDateCompact,
  formatPrice,
  getRelativeDateLabel,
  getReturnDueLabel,
} from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Circle,
  Heart,
  Package,
  RotateCcw,
} from "lucide-react";

export {
  adminInputClass,
  adminTextareaClass,
  adminSelectTriggerClass,
  adminPrimaryButtonClass,
  adminOutlineButtonClass,
  AdminFormShell,
  AdminFormLayout,
  AdminFormRow,
  AdminFormCard,
  AdminFormAlert,
  AdminFormActions,
  AdminToggleRow,
  AdminFormSection,
  AdminFieldLabel,
} from "@/components/admin/admin-form";

/* ─── Page header ─── */

export function AdminPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#2D3328] md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-[#6B7565]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ─── Cards & panels ─── */

export function AdminPanel({
  title,
  description,
  action,
  children,
  className,
  noPadding,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-[#E8EBE4] bg-white shadow-[0_1px_10px_rgba(45,51,40,0.05)]",
        className
      )}
    >
      {(title || description || action) && (
        <header className="flex flex-col gap-2 border-b border-[#EEF2E8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-[#2D3328]">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-[#8A9480]">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn(!noPadding && "p-4")}>{children}</div>
    </section>
  );
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  href,
  trend,
  className,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  trend?: string;
  className?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#8A9480]">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF2E8] text-[#6B7B52]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-[#2D3328]">
        {value}
      </p>
      {trend && <p className="mt-1 text-xs text-[#8A9480]">{trend}</p>}
    </>
  );

  const shell = cn(
    "block rounded-xl border border-[#E8EBE4] bg-white p-4 shadow-[0_1px_10px_rgba(45,51,40,0.05)] transition-all hover:border-[#C5D4B8] hover:shadow-[0_2px_14px_rgba(45,51,40,0.07)]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={shell}>
        {content}
      </Link>
    );
  }

  return <div className={shell}>{content}</div>;
}

export function AdminEmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-[#D8DFD0] bg-[#F7F9F5] px-4 py-8 text-center">
      <p className="text-sm text-[#8A9480]">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminListRow({
  primary,
  secondary,
  trailing,
}: {
  primary: string;
  secondary?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#EEF2E8] py-3 last:border-0 last:pb-0 first:pt-0">
      <div className="min-w-0">
        <p className="truncate font-medium text-[#2D3328]">{primary}</p>
        {secondary && (
          <p className="truncate text-sm text-[#8A9480]">{secondary}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

/* ─── Status badges ─── */

const toneStyles = {
  neutral: "bg-[#EEF2E8] text-[#5A6352]",
  success: "bg-[#E4F0E4] text-[#3D6B3D]",
  warning: "bg-[#FDF4E3] text-[#8B6914]",
  danger: "bg-[#FCEAEA] text-[#9B3A3A]",
  info: "bg-[#E8EEF5] text-[#3D5A80]",
  progress: "bg-[#EDE8F5] text-[#5A4A80]",
};

export function AdminStatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
        toneStyles[tone]
      )}
    >
      {children}
    </span>
  );
}

export function AdminStageBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  if (["CONFIRMED", "COMPLETED", "RETURNED", "DELIVERED", "ACTIVE"].includes(normalized)) {
    return (
      <AdminStatusBadge tone="success">
        <CheckCircle2 className="h-3 w-3" />
        {status}
      </AdminStatusBadge>
    );
  }

  if (["PENDING", "INQUIRY", "IN_PRODUCTION", "QUOTED", "OVERDUE", "PICKED_UP"].includes(normalized)) {
    return (
      <AdminStatusBadge tone={normalized === "OVERDUE" ? "danger" : normalized === "PICKED_UP" ? "info" : "warning"}>
        <Clock3 className="h-3 w-3" />
        {status.replace(/_/g, " ")}
      </AdminStatusBadge>
    );
  }

  if (["CANCELLED", "CANCELED", "INACTIVE"].includes(normalized)) {
    return (
      <AdminStatusBadge tone="danger">
        <XCircle className="h-3 w-3" />
        {status}
      </AdminStatusBadge>
    );
  }

  return (
    <AdminStatusBadge tone="info">
      <Circle className="h-3 w-3" />
      {status.replace(/_/g, " ")}
    </AdminStatusBadge>
  );
}

/* ─── Booking table cells ─── */

function AdminScheduleStep({
  icon: Icon,
  label,
  date,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  date: Date | string;
  hint?: string | null;
  tone?: "default" | "danger" | "accent";
}) {
  const hintTone =
    tone === "danger"
      ? "text-[#9B3A3A] font-medium"
      : tone === "accent"
        ? "text-[#6B7B52] font-medium"
        : "text-[#A8B09E]";

  return (
    <div className="relative flex gap-2.5">
      <div
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 bg-white",
          tone === "danger"
            ? "border-[#E8C5C5] text-[#9B3A3A]"
            : tone === "accent"
              ? "border-[#C5D4B8] text-[#6B7B52]"
              : "border-[#D8DFD0] text-[#8A9480]"
        )}
      >
        <Icon className="h-2 w-2" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#A8B09E]">
          {label}
        </p>
        <p
          className={cn(
            "text-sm tabular-nums",
            tone === "danger" ? "font-medium text-[#9B3A3A]" : "text-[#2D3328]"
          )}
        >
          {formatAdminDateCompact(date)}
        </p>
        {hint && <p className={cn("mt-0.5 text-xs", hintTone)}>{hint}</p>}
      </div>
    </div>
  );
}

export function AdminBookingSchedule({
  weddingDate,
  pickupDate,
  returnDeadline,
  eventLocation,
  status,
}: {
  weddingDate: Date | string;
  pickupDate: Date | string;
  returnDeadline: Date | string;
  eventLocation?: string | null;
  status: string;
}) {
  const weddingRelative = getRelativeDateLabel(weddingDate);
  const pickupRelative = getRelativeDateLabel(pickupDate);
  const returnHint = getReturnDueLabel(returnDeadline, status);
  const isOverdue = status.toUpperCase() === "OVERDUE";

  return (
    <div className="min-w-[210px]">
      <div className="mb-3 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5 text-[#6B7B52]" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-[#8A9480]">
            Wedding day
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold tabular-nums text-[#2D3328]">
          {formatAdminDate(weddingDate)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          {eventLocation && (
            <span className="text-[#8A9480]">{eventLocation}</span>
          )}
          {weddingRelative && (
            <span className="font-medium text-[#6B7B52]">{weddingRelative}</span>
          )}
        </div>
      </div>

      <div className="relative space-y-3 pl-0.5">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[#E8EBE4]" />
        <AdminScheduleStep
          icon={Package}
          label="Pickup"
          date={pickupDate}
          hint={pickupRelative}
          tone="accent"
        />
        <AdminScheduleStep
          icon={RotateCcw}
          label="Return by"
          date={returnDeadline}
          hint={returnHint}
          tone={isOverdue ? "danger" : "default"}
        />
      </div>
    </div>
  );
}

type MoneyInput = number | string | { toString(): string };

export function AdminBookingPayment({
  bookingDeposit,
  balanceDue,
  securityDeposit,
  lateFeesAccrued,
}: {
  bookingDeposit: MoneyInput;
  balanceDue: MoneyInput;
  securityDeposit?: MoneyInput;
  lateFeesAccrued?: MoneyInput;
}) {
  const deposit = Number(bookingDeposit);
  const balance = Number(balanceDue);
  const security = securityDeposit != null ? Number(securityDeposit) : 0;
  const lateFees = lateFeesAccrued != null ? Number(lateFeesAccrued) : 0;
  const total = deposit + balance;

  return (
    <div className="min-w-[180px] space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wide text-[#A8B09E]">
          Total hire
        </span>
        <span className="text-sm font-semibold tabular-nums text-[#2D3328]">
          {formatPrice(total)}
        </span>
      </div>
      <div className="space-y-1.5 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] px-3 py-2.5 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-[#8A9480]">Deposit paid</span>
          <span className="tabular-nums text-[#3D4538]">
            {formatPrice(deposit)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[#8A9480]">Balance due</span>
          <span className="font-medium tabular-nums text-[#2D3328]">
            {formatPrice(balance)}
          </span>
        </div>
        {security > 0 && (
          <div className="flex justify-between gap-4 border-t border-[#EEF2E8] pt-1.5">
            <span className="text-[#8A9480]">Security hold</span>
            <span className="tabular-nums text-[#8A9480]">
              {formatPrice(security)}
            </span>
          </div>
        )}
        {lateFees > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-[#9B3A3A]">Late fees</span>
            <span className="font-medium tabular-nums text-[#9B3A3A]">
              {formatPrice(lateFees)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Data table ─── */

export function AdminTable({
  children,
  toolbar,
  className,
}: {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#E8EBE4] bg-white shadow-[0_1px_10px_rgba(45,51,40,0.05)]",
        className
      )}
    >
      {toolbar && (
        <div className="flex flex-col gap-2 border-b border-[#EEF2E8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTableElement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <table className={cn("w-full text-sm", className)}>
      {children}
    </table>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-[#EEF2E8] bg-[#F7F9F5]">{children}</tr>
    </thead>
  );
}

export function AdminTableHeadCell({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[#8A9480]",
        className
      )}
    >
      {children}
    </th>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[#EEF2E8]">{children}</tbody>;
}

export function AdminTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-[#FAFBF9]", className)}>
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3 text-[#5A6352]", className)}>{children}</td>
  );
}

export function AdminTableEmpty({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-[#8A9480]">
        {message}
      </td>
    </tr>
  );
}

/* ─── Resource cards (promotions, packages) ─── */

export function AdminResourceCard({
  image,
  imageFallback,
  title,
  badge,
  meta,
  description,
  footer,
  className,
}: {
  image?: string | null;
  imageFallback?: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-[#E8EBE4] bg-white shadow-[0_1px_10px_rgba(45,51,40,0.05)] transition-all hover:shadow-[0_2px_14px_rgba(45,51,40,0.07)]",
        className
      )}
    >
      {image ? (
        <div className="aspect-[16/10] overflow-hidden bg-[#EEF2E8]">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        imageFallback
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#2D3328]">{title}</h3>
          {badge}
        </div>
        {meta && <div className="mb-2">{meta}</div>}
        {description && (
          <p className="mb-3 flex-1 text-sm leading-relaxed text-[#8A9480]">
            {description}
          </p>
        )}
        {footer && (
          <div className="mt-auto flex items-center justify-between border-t border-[#EEF2E8] pt-3">
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Category tree card ─── */

export function AdminCategoryGroup({
  title,
  description,
  image,
  editHref,
  children,
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  editHref: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8EBE4] bg-white shadow-[0_1px_10px_rgba(45,51,40,0.05)]">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-start gap-4">
          {image ? (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#EEF2E8]">
              <img src={image} alt={title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EEF2E8] text-sm font-semibold text-[#6B7B52]">
              {title.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-[#2D3328]">{title}</h3>
            {description && (
              <p className="mt-0.5 text-sm text-[#8A9480]">{description}</p>
            )}
          </div>
        </div>
        <Link
          href={editHref}
          className="shrink-0 rounded-lg border border-[#E8EBE4] px-3 py-1.5 text-sm font-medium text-[#5A6352] transition-colors hover:bg-[#EEF2E8]"
        >
          Edit
        </Link>
      </div>
      {children && (
        <div className="border-t border-[#EEF2E8] bg-[#FAFBF9] px-4 py-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

export function AdminCategoryChild({
  name,
  image,
  productCount,
  editHref,
}: {
  name: string;
  image?: string | null;
  productCount: number;
  editHref: string;
}) {
  return (
    <div className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white">
      <div className="flex items-center gap-3">
        {image ? (
          <div className="h-8 w-8 overflow-hidden rounded-lg bg-[#EEF2E8]">
            <img src={image} alt={name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2E8] text-xs font-medium text-[#6B7B52]">
            {name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-[#3D4538]">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-[#EEF2E8] px-2 py-0.5 text-xs font-medium text-[#6B7B52]">
          {productCount} products
        </span>
        <Link
          href={editHref}
          className="text-sm font-medium text-[#6B7B52] opacity-0 transition-opacity group-hover:opacity-100"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
