import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/* ─── Shared field styles ─── */

export const adminInputClass =
  "h-11 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] text-[#2D3328] placeholder:text-[#A8B09E] focus-visible:ring-[#6B7B52]/30";

export const adminTextareaClass =
  "min-h-[120px] rounded-xl border-[#E8EBE4] bg-[#F7F9F5] focus-visible:ring-[#6B7B52]/30";

export const adminSelectTriggerClass =
  "h-11 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] focus:ring-[#6B7B52]/30";

export const adminPrimaryButtonClass =
  "rounded-xl bg-gradient-to-r from-[#6B7B52] to-[#556347] text-white shadow-[0_4px_14px_rgba(91,107,79,0.3)] hover:opacity-95";

export const adminOutlineButtonClass =
  "rounded-xl border-[#E8EBE4] bg-white text-[#5A6352] hover:bg-[#EEF2E8]";

/* ─── Page shell ─── */

export function AdminFormShell({
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-4">
      {backHref && (
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#8A9480] transition-colors hover:text-[#6B7B52]"
        >
          <span aria-hidden>←</span>
          {backLabel || "Back"}
        </Link>
      )}
      <div className="mb-4 border-b border-[#E8EBE4] pb-4">
        <h1 className="text-xl font-bold tracking-tight text-[#2D3328] md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-[#6B7565]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Layout ─── */

export function AdminFormLayout({
  main,
  sidebar,
}: {
  main: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  if (!sidebar) {
    return <div className="max-w-3xl space-y-4">{main}</div>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-5">
      <div className="min-w-0 space-y-4">{main}</div>
      <aside className="space-y-4 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-5.5rem)] xl:self-start xl:overflow-y-auto">
        {sidebar}
      </aside>
    </div>
  );
}

export function AdminFormRow({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Section cards ─── */

export function AdminFormCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-[#E8EBE4] bg-white shadow-[0_1px_10px_rgba(45,51,40,0.05)]",
        className
      )}
    >
      <header className="flex items-start gap-2.5 border-b border-[#EEF2E8] bg-[#FAFBF9] px-4 py-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF2E8] text-[#6B7B52]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[#2D3328]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-[#8A9480]">
              {description}
            </p>
          )}
        </div>
      </header>
      <div className={cn("space-y-4 p-4", contentClassName)}>
        {children}
      </div>
    </section>
  );
}

/* ─── Alerts & actions ─── */

export function AdminFormAlert({
  children,
  variant = "error",
  className,
}: {
  children: React.ReactNode;
  variant?: "error" | "success";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3 text-sm",
        variant === "error"
          ? "border border-[#E8C5C5] bg-[#FCEAEA] text-[#9B3A3A]"
          : "border border-[#C5DFC5] bg-[#E4F0E4] text-[#3D6B3D]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminFormActions({
  children,
  leading,
}: {
  children: React.ReactNode;
  leading?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse gap-2.5 border-t border-[#E8EBE4] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>{leading}</div>
      <div className="flex flex-wrap justify-end gap-3">{children}</div>
    </div>
  );
}

/* ─── Toggle row ─── */

export function AdminToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] px-4 py-3.5">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium text-[#2D3328]">
          {label}
        </Label>
        {description && (
          <p className="mt-0.5 text-xs text-[#8A9480]">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

/* ─── Settings-style stacked sections ─── */

export function AdminFormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <AdminFormCard title={title} description={description} icon={icon}>
      {children}
    </AdminFormCard>
  );
}

/* ─── Media drop zone label ─── */

export function AdminFieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2">
      <p className="text-sm font-medium text-[#2D3328]">{children}</p>
      {hint && <p className="mt-0.5 text-xs text-[#8A9480]">{hint}</p>}
    </div>
  );
}
