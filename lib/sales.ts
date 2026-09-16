import type {
  BookingStatus,
  CustomOrderStatus,
  DressBooking,
  CustomOrder,
  Inquiry,
  Product,
  SalePaymentStatus,
  SaleType,
} from "@prisma/client";

export type SalesPeriod = "weekly" | "monthly" | "yearly";

export const SALES_PERIODS: SalesPeriod[] = ["weekly", "monthly", "yearly"];

type BookingLike = Pick<
  DressBooking,
  | "status"
  | "bookingDeposit"
  | "balanceDue"
  | "lateFeesAccrued"
  | "customerName"
  | "customerPhone"
  | "createdAt"
  | "weddingDate"
>;

type CustomOrderLike = Pick<
  CustomOrder,
  | "status"
  | "quoteAmount"
  | "depositPaid"
  | "customerName"
  | "customerPhone"
  | "createdAt"
  | "eventDate"
>;

type InquiryLike = Pick<
  Inquiry,
  "status" | "totalAmount" | "customerName" | "customerPhone" | "createdAt"
>;

export function bookingHireTotal(booking: BookingLike): number {
  return (
    Number(booking.bookingDeposit) +
    Number(booking.balanceDue) +
    Number(booking.lateFeesAccrued)
  );
}

export function bookingPaidAmount(booking: BookingLike): number {
  if (booking.status === "CANCELLED") return 0;

  let paid = 0;
  const deposit = Number(booking.bookingDeposit);
  const balance = Number(booking.balanceDue);
  const lateFees = Number(booking.lateFeesAccrued);

  if (
    ["CONFIRMED", "PICKED_UP", "RETURNED", "COMPLETED", "OVERDUE"].includes(
      booking.status
    )
  ) {
    paid += deposit;
  }

  if (["RETURNED", "COMPLETED"].includes(booking.status)) {
    paid += balance;
  }

  paid += lateFees;
  return paid;
}

export function bookingPaymentStatus(
  booking: BookingLike
): SalePaymentStatus {
  if (booking.status === "CANCELLED") return "CANCELLED";

  const total = bookingHireTotal(booking);
  const paid = bookingPaidAmount(booking);

  if (paid <= 0) return "QUOTED";
  if (paid >= total) return "PAID";
  if (paid > 0 && paid < total) {
    return paid <= Number(booking.bookingDeposit) ? "DEPOSIT_RECEIVED" : "PARTIALLY_PAID";
  }
  return "QUOTED";
}

export function customOrderTotal(order: CustomOrderLike): number {
  return Number(order.quoteAmount ?? 0);
}

export function customOrderPaidAmount(order: CustomOrderLike): number {
  if (!order.quoteAmount) return Number(order.depositPaid ?? 0);
  if (order.status === "DELIVERED") return Number(order.quoteAmount);
  return Number(order.depositPaid ?? 0);
}

export function customOrderPaymentStatus(
  order: CustomOrderLike
): SalePaymentStatus {
  const total = customOrderTotal(order);
  const paid = customOrderPaidAmount(order);

  if (total <= 0) return "QUOTED";
  if (paid >= total) return "PAID";
  if (paid > 0) {
    return order.status === "DEPOSIT_PAID" ? "DEPOSIT_RECEIVED" : "PARTIALLY_PAID";
  }
  return "QUOTED";
}

export function inquirySaleAmount(inquiry: InquiryLike): number {
  return Number(inquiry.totalAmount ?? 0);
}

export function inquiryPaymentStatus(
  inquiry: InquiryLike,
  paidAmount = 0
): SalePaymentStatus {
  if (inquiry.status === "CANCELLED") return "CANCELLED";
  const total = inquirySaleAmount(inquiry);
  if (total > 0) return paymentStatusFromAmounts(paidAmount, total);
  if (inquiry.status === "COMPLETED") return "PAID";
  return "QUOTED";
}

export function paymentStatusFromAmounts(
  paid: number,
  total: number,
  cancelled = false
): SalePaymentStatus {
  if (cancelled) return "CANCELLED";
  if (total <= 0) return "QUOTED";
  if (paid <= 0) return "QUOTED";
  if (paid >= total) return "PAID";
  if (paid <= total * 0.45) return "DEPOSIT_RECEIVED";
  return "PARTIALLY_PAID";
}

export type EventBookingLike = {
  status: string;
  quotedAmount: unknown;
  depositPaid: unknown;
};

export function eventBookingTotal(booking: EventBookingLike): number {
  return Number(booking.quotedAmount);
}

export function eventBookingPaidAmount(booking: EventBookingLike): number {
  if (booking.status === "CANCELLED") return 0;
  if (booking.status === "COMPLETED") return Number(booking.quotedAmount);
  if (["DEPOSIT_PAID", "CONFIRMED"].includes(booking.status)) {
    return Number(booking.depositPaid);
  }
  return Number(booking.depositPaid);
}

export function eventBookingPaymentStatus(
  booking: EventBookingLike
): SalePaymentStatus {
  if (booking.status === "CANCELLED") return "CANCELLED";
  return paymentStatusFromAmounts(
    eventBookingPaidAmount(booking),
    eventBookingTotal(booking)
  );
}

export function eventBookingSaleTitle(
  booking: EventBookingLike & {
    customerName: string;
    eventPackage?: { name: string } | null;
  }
): string {
  const pkg = booking.eventPackage?.name ?? "Event package";
  return `${pkg} — ${booking.customerName}`;
}

export function bookingSaleTitle(
  booking: DressBooking & { product?: Product | null }
): string {
  return `Dress hire — ${booking.product?.name ?? "Booking"}`;
}

export function customOrderSaleTitle(order: CustomOrder): string {
  return `Custom order — ${order.customerName}`;
}

export function inquirySaleTitle(
  inquiry: Inquiry & {
    product?: Product | null;
    eventPackage?: { name: string } | null;
  }
): string {
  if (inquiry.eventPackage?.name) {
    return `Event package — ${inquiry.eventPackage.name}`;
  }
  if (inquiry.product?.name) {
    return `Inquiry sale — ${inquiry.product.name}`;
  }
  return `Inquiry — ${inquiry.customerName}`;
}

export const PAYMENT_METHOD_LABELS = {
  CASH: "Cash",
  WHATSAPP: "WhatsApp",
  BANK_TRANSFER: "Bank transfer",
  MOBILE_MONEY: "Mobile money",
  CARD: "Card",
  OTHER: "Other",
} as const;

export function isCountableRevenue(status: SalePaymentStatus): boolean {
  return !["CANCELLED", "REFUNDED", "QUOTED"].includes(status);
}

export function getRangeStart(period: SalesPeriod): Date {
  const now = new Date();
  const start = new Date(now);

  if (period === "weekly") {
    start.setDate(start.getDate() - 7 * 8);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "monthly") {
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  start.setFullYear(start.getFullYear() - 4);
  start.setMonth(0, 1);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function bucketKey(date: Date, period: SalesPeriod): string {
  const d = new Date(date);
  if (period === "weekly") {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10);
  }
  if (period === "monthly") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return String(d.getFullYear());
}

export function bucketLabel(key: string, period: SalesPeriod): string {
  if (period === "weekly") {
    const d = new Date(key);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  if (period === "monthly") {
    const [year, month] = key.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
  }
  return key;
}

export function initBuckets(period: SalesPeriod): Map<string, { revenue: number; count: number }> {
  const buckets = new Map<string, { revenue: number; count: number }>();
  const now = new Date();

  if (period === "weekly") {
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = bucketKey(d, period);
      if (!buckets.has(key)) buckets.set(key, { revenue: 0, count: 0 });
    }
    return buckets;
  }

  if (period === "monthly") {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.set(bucketKey(d, period), { revenue: 0, count: 0 });
    }
    return buckets;
  }

  for (let i = 4; i >= 0; i--) {
    const year = now.getFullYear() - i;
    buckets.set(String(year), { revenue: 0, count: 0 });
  }
  return buckets;
}

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  DRESS_HIRE: "Dress hire",
  DRESS_PURCHASE: "Dress purchase",
  CUSTOM_ORDER: "Custom order",
  EVENT_PACKAGE: "Event package",
  FITTING: "Fitting fee",
  OTHER: "Other",
};

export type SalesChartPoint = {
  key: string;
  label: string;
  revenue: number;
  count: number;
};
