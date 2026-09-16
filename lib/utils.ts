import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_CURRENCY } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${DEFAULT_CURRENCY} ${num.toLocaleString("en-MW")}`;
}

const adminDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const adminDateCompactFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function startOfDay(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

export function daysBetween(from: Date, to: Date) {
  const ms =
    startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatAdminDate(date: Date | string) {
  const value = date instanceof Date ? date : new Date(date);
  return adminDateFormatter.format(value);
}

export function formatAdminDateCompact(date: Date | string) {
  const value = date instanceof Date ? date : new Date(date);
  return adminDateCompactFormatter.format(value);
}

export function getRelativeDateLabel(
  target: Date | string,
  reference: Date | string = new Date()
) {
  const diff = daysBetween(
    reference instanceof Date ? reference : new Date(reference),
    target instanceof Date ? target : new Date(target)
  );

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1 && diff <= 21) return `In ${diff} days`;
  if (diff < -1 && diff >= -21) return `${Math.abs(diff)} days ago`;
  return null;
}

export function getReturnDueLabel(
  returnDeadline: Date | string,
  status: string,
  reference: Date | string = new Date()
) {
  const normalized = status.toUpperCase();
  if (["RETURNED", "COMPLETED", "CANCELLED"].includes(normalized)) return null;

  const now = reference instanceof Date ? reference : new Date(reference);
  const deadline =
    returnDeadline instanceof Date ? returnDeadline : new Date(returnDeadline);
  const overdueDays = daysBetween(deadline, now);

  if (normalized === "OVERDUE" || overdueDays > 0) {
    const days = Math.max(overdueDays, 1);
    return `${days} day${days === 1 ? "" : "s"} overdue`;
  }

  const until = daysBetween(now, deadline);
  if (until === 0) return "Due today";
  if (until === 1) return "Due tomorrow";
  if (until <= 7) return `Due in ${until} days`;
  return null;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getParentCategoryBadge(parentSlug?: string | null) {
  switch (parentSlug) {
    case "dresses-in-stock":
      return { label: "In Stock", variant: "stock" as const };
    case "previous-custom-orders":
      return { label: "Previous Custom", variant: "portfolio" as const };
    case "inspo-custom-orders":
      return { label: "Inspo", variant: "inspo" as const };
    default:
      return null;
  }
}

export function calculatePickupDate(
  weddingDate: Date,
  location: "Blantyre" | "outside"
) {
  const days =
    location === "Blantyre"
      ? 4
      : 6;
  const pickup = new Date(weddingDate);
  pickup.setDate(pickup.getDate() - days);
  return pickup;
}

export function calculateReturnDeadline(
  weddingDate: Date,
  location: "Blantyre" | "outside"
) {
  const days = location === "Blantyre" ? 4 : 6;
  const deadline = new Date(weddingDate);
  deadline.setDate(deadline.getDate() + days);
  return deadline;
}
